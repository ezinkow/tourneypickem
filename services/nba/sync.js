const axios = require("axios");
const db = require("../../models");

const SCOREBOARD_URL = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=20260418-20260620";

const ROUND_CONFIG = {
    1: { label: "R1", maxPoints: 32 },
    2: { label: "R2", maxPoints: 24 },
    3: { label: "R3", maxPoints: 16 },
    4: { label: "Finals", maxPoints: 8 },
};

const TEAM_TO_SEED = {
    // East
    "Detroit Pistons": 1, "Boston Celtics": 2,
    "New York Knicks": 3, "Cleveland Cavaliers": 4,
    "Toronto Raptors": 5, "Atlanta Hawks": 6,
    "Philadelphia 76ers": 7, "Orlando Magic": 7, "76ers/Magic": 7,
    // West
    "Oklahoma City Thunder": 1, "San Antonio Spurs": 2,
    "Denver Nuggets": 3, "Los Angeles Lakers": 4,
    "Houston Rockets": 5, "Minnesota Timberwolves": 6,
    "Phoenix Suns": 7, "Portland Trail Blazers": 7, "Suns/Trail Blazers": 7,
};

function getRound(headline) {
    if (headline && headline.includes("Finals") && !headline.includes("Conf.")) return 4;
    if (headline && headline.includes("Conf. Finals")) return 3;
    if (headline && headline.includes("2nd Round")) return 2;
    return 1;
}

function getConference(headline) {
    if (!headline) return "";
    if (headline.includes("East")) return "E";
    if (headline.includes("West")) return "W";
    return "";
}

function makeSeriesId(roundNum, conf, s) {
    let hSeed = TEAM_TO_SEED[s.home.team.displayName] || s.home.seed;
    let aSeed = TEAM_TO_SEED[s.away.team.displayName] || s.away.seed;

    if (roundNum === 1 && (!hSeed || !aSeed)) {
        if (hSeed === 1 || aSeed === 1) {
            hSeed = hSeed || 8;
            aSeed = aSeed || 8;
        } else if (hSeed === 2 || aSeed === 2) {
            hSeed = hSeed || 7;
            aSeed = aSeed || 7;
        }
    }

    hSeed = hSeed || s.home.team.abbreviation || "TBD";
    aSeed = aSeed || s.away.team.abbreviation || "TBD";

    const pair = [hSeed, aSeed].sort((a, b) =>
        String(a).localeCompare(String(b), undefined, { numeric: true })
    );

    return `R${roundNum}-${conf}-${pair[0]}-${pair[1]}`;
}

function extractSeries(data) {
    if (!data?.events) return [];

    // This will hold our aggregated series data
    const seriesMap = new Map();

    // This will hold our manually calculated win counts for the WHOLE feed
    const globalWinTally = {}; // e.g. { "Detroit Pistons": 1, "Orlando Magic": 0 }

    // 1. FIRST PASS: Tally every COMPLETED game in the entire scoreboard response
    for (const event of data.events) {
        const comp = event.competitions?.[0];
        if (!comp || comp.status.type.name !== "STATUS_FINAL") continue;

        const home = comp.competitors.find(c => c.homeAway === "home");
        const away = comp.competitors.find(c => c.homeAway === "away");

        if (home.winner === true) {
            globalWinTally[home.team.displayName] = (globalWinTally[home.team.displayName] || 0) + 1;
        }
        if (away.winner === true) {
            globalWinTally[away.team.displayName] = (globalWinTally[away.team.displayName] || 0) + 1;
        }
    }

    // 2. SECOND PASS: Identify the unique series and assign the tallied wins
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    for (const event of data.events) {
        const comp = event.competitions?.[0];
        if (!comp) continue;

        // Skip games too far in future
        const eventDate = new Date(event.date);
        if (eventDate > sevenDaysFromNow) continue;

        const homeComp = comp.competitors.find(c => c.homeAway === "home");
        const awayComp = comp.competitors.find(c => c.homeAway === "away");

        if (!homeComp || !awayComp || homeComp.team.displayName === "TBD") continue;

        const headline = comp.notes?.[0]?.headline || "";
        const roundNum = getRound(headline);
        const conf = getConference(headline);
        const seriesId = makeSeriesId(roundNum, conf, { home: homeComp, away: awayComp });

        // Get the current wins for these two teams from our global tally
        const hWins = globalWinTally[homeComp.team.displayName] || 0;
        const aWins = globalWinTally[awayComp.team.displayName] || 0;

        // Only process the series once in the map
        if (!seriesMap.has(seriesId)) {
            const totalPlayed = hWins + aWins;
            let nextGameDate = event.date;
            if (comp.series?.games && comp.series.games[totalPlayed]) {
                nextGameDate = comp.series.games[totalPlayed].date;
            }

            seriesMap.set(seriesId, {
                id: seriesId,
                roundNum,
                conf,
                home: homeComp,
                away: awayComp,
                status: comp.status,
                startDate: nextGameDate,
                homeWins: hWins,
                awayWins: aWins
            });
        }
    }

    console.log(`[NBA sync] Unique series identified: ${seriesMap.size}`);
    return Array.from(seriesMap.values());
}

async function processSeries(s) {
    const { NbaSeries } = db;
    try {
        const roundCfg = ROUND_CONFIG[s.roundNum];
        const existing = await NbaSeries.findByPk(s.id);

        // STICKY WINS: Math.max ensures we only ever go forward in games
        const finalHomeWins = Math.max(s.homeWins, existing?.home_wins || 0);
        const finalAwayWins = Math.max(s.awayWins, existing?.away_wins || 0);
        const seriesOver = finalHomeWins === 4 || finalAwayWins === 4;

        let seriesStatus = "STATUS_SCHEDULED";
        if (seriesOver) {
            seriesStatus = "STATUS_FINAL";
        } else if (s.status.type.name === "STATUS_IN_PROGRESS") {
            seriesStatus = "STATUS_IN_PROGRESS";
        }

        const now = new Date();
        const startTime = new Date(s.startDate);
        const isLocked = existing?.locked || (now >= startTime) || (s.status.type.name !== "STATUS_SCHEDULED");

        await NbaSeries.upsert({
            id: s.id,
            round: s.roundNum,
            round_label: roundCfg.label,
            round_points_max: roundCfg.maxPoints,
            home_team: s.home.team.displayName,
            away_team: s.away.team.displayName,
            status: seriesStatus,
            game_date: s.startDate,
            home_wins: finalHomeWins,
            away_wins: finalAwayWins,
            locked: isLocked,
            winner: finalHomeWins === 4 ? s.home.team.displayName : (finalAwayWins === 4 ? s.away.team.displayName : null),
            series_length: seriesOver ? (finalHomeWins + finalAwayWins) : null
        });

        console.log(`[NBA sync] ${s.id}: ${finalAwayWins}-${finalHomeWins} | ${isLocked ? 'LOCKED' : 'OPEN'}`);
    } catch (err) {
        console.error(`[NBA sync] Error on ${s.id}:`, err.message);
    }
}

async function syncNba() {
    try {
        const { data } = await axios.get(SCOREBOARD_URL, { timeout: 10000 });
        const series = extractSeries(data);

        if (!series.length) {
            console.log("[NBA sync] No events found in range");
            return;
        }

        for (const s of series) {
            await processSeries(s);
        }

        console.log(`[NBA sync] Done — ${series.length} series updated`);
    } catch (err) {
        console.error("[NBA sync] Failed:", err.message);
    }
}

module.exports = syncNba;