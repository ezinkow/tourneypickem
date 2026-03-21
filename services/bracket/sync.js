const fetch = require("node-fetch");
const { GamesBracket } = require("../../models/bracket");
const TOURNAMENT_ID = "22";

function parseHeadline(headline) {
    let region = null;
    let round = null;
    let roundLabel = null;
    let roundPoints = 1;
    if (headline.includes("First Four")) {
        round = 0; roundLabel = "First Four"; roundPoints = 0;
    } else if (headline.includes("1st Round")) {
        round = 1; roundLabel = "1st Round"; roundPoints = 1;
    } else if (headline.includes("2nd Round")) {
        round = 2; roundLabel = "2nd Round"; roundPoints = 2;
    } else if (headline.includes("Sweet 16")) {
        round = 3; roundLabel = "Sweet 16"; roundPoints = 4;
    } else if (headline.includes("Elite 8")) {
        round = 4; roundLabel = "Elite 8"; roundPoints = 8;
    } else if (headline.includes("Final Four")) {
        round = 5; roundLabel = "Final Four"; roundPoints = 16;
    } else if (headline.includes("National Championship")) {
        round = 6; roundLabel = "National Championship"; roundPoints = 32;
    }
    if (headline.includes("South Region")) region = "South";
    else if (headline.includes("East Region")) region = "East";
    else if (headline.includes("West Region")) region = "West";
    else if (headline.includes("Midwest Region")) region = "Midwest";
    else if (round >= 5) region = "Final Four";
    return { region, round, roundLabel, roundPoints };
}

const SEED_TO_SLOT = {
    "1-16": 1, "8-9": 2, "5-12": 3, "4-13": 4,
    "6-11": 5, "3-14": 6, "7-10": 7, "2-15": 8,
};

// Which R1 bracket_slot does a given seed belong to?
const SEED_TO_R1_SLOT = {
    1: 1, 16: 1,
    8: 2, 9: 2,
    5: 3, 12: 3,
    4: 4, 13: 4,
    6: 5, 11: 5,
    3: 6, 14: 6,
    7: 7, 10: 7,
    2: 8, 15: 8,
};

// R1 slot pairs that produce each R2 bracket_slot
// R2 slot 1 = R1 slots 1&2, R2 slot 2 = R1 slots 3&4, etc.
function getR2SlotFromSeeds(homeSeed, awaySeed) {
    const homeR1Slot = SEED_TO_R1_SLOT[homeSeed];
    const awayR1Slot = SEED_TO_R1_SLOT[awaySeed];
    if (!homeR1Slot || !awayR1Slot) return null;
    // Both seeds should come from adjacent R1 slot pairs (1&2, 3&4, 5&6, 7&8)
    const slots = [homeR1Slot, awayR1Slot].sort((a, b) => a - b);
    if (slots[0] === 1 && slots[1] === 2) return 1;
    if (slots[0] === 3 && slots[1] === 4) return 2;
    if (slots[0] === 5 && slots[1] === 6) return 3;
    if (slots[0] === 7 && slots[1] === 8) return 4;
    // Upset scenario: both from same slot pair side, fall back to lower slot number
    // e.g. 1 seed vs 5 seed (upsets) — use the lower R1 slot's pair
    const minSlot = Math.min(homeR1Slot, awayR1Slot);
    return Math.ceil(minSlot / 2);
}

// For Sweet 16+, bracket_slot is always 1 per region (one game per region per round)
// For Final Four, slot 1 = East/South side, slot 2 = West/Midwest side (set manually or preserved)
function getBracketSlot(homeSeed, awaySeed, round) {
    if (round === 1) {
        const seeds = [homeSeed, awaySeed].sort((a, b) => a - b);
        const key = `${seeds[0]}-${seeds[1]}`;
        return SEED_TO_SLOT[key] || null;
    }
    if (round === 2 && homeSeed && awaySeed) {
        return getR2SlotFromSeeds(homeSeed, awaySeed);
    }
    // Round 3+ (Sweet 16, Elite 8): 1 game per region, slot is always 1
    // Final Four / Championship: preserve existing from DB — don't overwrite
    return null;
}

async function syncBracketGames() {
    const url = "https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?groups=50&limit=100&dates=20260319-20260406";
    try {
        const response = await fetch(url);
        const data = await response.json();

        const existingGames = await GamesBracket.findAll();
        const existingMap = {};
        for (const g of existingGames) existingMap[g.id] = g;

        for (const event of data.events) {
            const comp = event?.competitions?.[0];
            if (!comp) continue;

            const tournamentId = (event.tournamentId || comp.tournamentId)?.toString();
            if (tournamentId !== TOURNAMENT_ID) continue;

            const headline = comp.notes?.[0]?.headline || "";
            const { region, round, roundLabel, roundPoints } = parseHeadline(headline);

            if (round === 0 || round === null) continue;

            const home = comp.competitors?.find(c => c.homeAway === "home");
            const away = comp.competitors?.find(c => c.homeAway === "away");

            const homeTeam = home?.team?.shortDisplayName || "TBD";
            const awayTeam = away?.team?.shortDisplayName || "TBD";
            const homeLogo = home?.team?.logo || null;
            const awayLogo = away?.team?.logo || null;
            const homeSeed = home?.curatedRank?.current < 99 ? home.curatedRank.current : null;
            const awaySeed = away?.curatedRank?.current < 99 ? away.curatedRank.current : null;
            const homeScore = parseInt(home?.score || 0);
            const awayScore = parseInt(away?.score || 0);
            const status = event.status?.type?.name || "STATUS_SCHEDULED";
            const gameClock = event.status?.type?.shortDetail || "";

            let winner = null;
            if (status === "STATUS_FINAL") {
                winner = homeScore > awayScore ? homeTeam : awayTeam;
            }

            const existingGame = existingMap[event.id];
            const isLocked = existingGame?.locked || false;

            // Derive bracket slot — always prefer computed value for R1/R2,
            // fall back to existing DB value for R3+ (Sweet 16 onward)
            const computedSlot = getBracketSlot(homeSeed, awaySeed, round);
            const bracketSlot = computedSlot || existingGame?.bracket_slot || null;

            await GamesBracket.upsert({
                id: event.id,
                game_date: event.date,
                region: region || existingGame?.region || null,
                round,
                round_label: roundLabel,
                round_points: roundPoints,
                bracket_slot: bracketSlot,
                home_team: isLocked
                    ? (existingGame?.home_team || homeTeam)
                    : (homeTeam !== "TBD" ? homeTeam : (existingGame?.home_team || homeTeam)),
                home_seed: isLocked
                    ? (existingGame?.home_seed || homeSeed)
                    : (homeSeed || existingGame?.home_seed || null),
                home_logo: isLocked
                    ? (existingGame?.home_logo || homeLogo)
                    : (homeLogo || existingGame?.home_logo || null),
                away_team: isLocked
                    ? (existingGame?.away_team || awayTeam)
                    : (awayTeam !== "TBD" ? awayTeam : (existingGame?.away_team || awayTeam)),
                away_seed: isLocked
                    ? (existingGame?.away_seed || awaySeed)
                    : (awaySeed || existingGame?.away_seed || null),
                away_logo: isLocked
                    ? (existingGame?.away_logo || awayLogo)
                    : (awayLogo || existingGame?.away_logo || null),
                home_score: homeScore,
                away_score: awayScore,
                winner,
                status,
                game_clock: gameClock,
                locked: isLocked,
            });
        }

        console.log("Bracket sync complete");
        return true;
    } catch (error) {
        console.error("Bracket sync error:", error);
        return false;
    }
}

module.exports = syncBracketGames;