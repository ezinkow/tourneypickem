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
    if (headline && (headline.includes("West Finals") || headline.includes("East Finals"))) return 3;
    if (headline && (headline.includes("West Semifinals") || headline.includes("East Semifinals"))) return 2;
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
        if (hSeed === 1 || aSeed === 1) { hSeed = hSeed || 8; aSeed = aSeed || 8; }
        else if (hSeed === 2 || aSeed === 2) { hSeed = hSeed || 7; aSeed = aSeed || 7; }
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
    const seriesMap = new Map();

    // 1. We NO LONGER use a global winTally.
    // Instead, we will calculate wins PER unique series headline.
    const seriesWinTally = {}; // { "R2-W-2-6": { "Spurs": 0, "Wolves": 0 } }

    data.events.forEach(event => {
        const comp = event.competitions?.[0];
        if (!comp) return;

        const headline = comp.notes?.[0]?.headline || "";
        const roundNum = getRound(headline);
        const conf = getConference(headline);

        const home = comp.competitors.find(c => c.homeAway === "home");
        const away = comp.competitors.find(c => c.homeAway === "away");
        if (!home || !away || home.team.displayName === "TBD") return;

        const seriesId = makeSeriesId(roundNum, conf, { home, away });

        // Initialize tally for this specific series
        if (!seriesWinTally[seriesId]) {
            seriesWinTally[seriesId] = {
                [home.team.displayName]: 0,
                [away.team.displayName]: 0
            };
        }

        // Only count the win if THIS specific game is finished
        if (comp.status?.type?.name === "STATUS_FINAL") {
            if (home.winner) seriesWinTally[seriesId][home.team.displayName]++;
            if (away.winner) seriesWinTally[seriesId][away.team.displayName]++;
        }

        // 2. Aggregate into SeriesMap
        if (!seriesMap.has(seriesId)) {
            seriesMap.set(seriesId, {
                id: seriesId,
                roundNum,
                conf,
                home: home,
                away: away,
                homeLogo: home.team.logo,
                awayLogo: away.team.logo,
                homeSeed: home.seed,
                awaySeed: away.seed,
                status: comp.status,
                startDate: event.date,
                // These are now scoped to the seriesId!
                homeWins: seriesWinTally[seriesId][home.team.displayName],
                awayWins: seriesWinTally[seriesId][away.team.displayName],
                roundLabel: headline || roundNum
            });
        } else {
            // Update the wins for the existing series entry in the map
            const existing = seriesMap.get(seriesId);
            existing.homeWins = seriesWinTally[seriesId][home.team.displayName];
            existing.awayWins = seriesWinTally[seriesId][away.team.displayName];
        }
    });

    return Array.from(seriesMap.values());
}

async function processSeries(s) {
    const { NbaSeries } = db;
    try {
        const roundCfg = ROUND_CONFIG[s.roundNum];
        const seriesOver = s.homeWins === 4 || s.awayWins === 4;

        let seriesStatus = "STATUS_SCHEDULED";
        if (seriesOver) {
            seriesStatus = "STATUS_FINAL";
        } else if (s.homeWins + s.awayWins > 0) {
            seriesStatus = "STATUS_IN_PROGRESS";
        }

        const now = new Date();
        const startTime = new Date(s.startDate);
        // Lock if game has started OR if wins have already been recorded
        const isLocked = (now >= startTime) || (s.homeWins + s.awayWins > 0);

        await NbaSeries.upsert({
            id: s.id,
            round: s.roundNum,
            round_label: roundCfg.label,
            round_points_max: roundCfg.maxPoints,
            home_team: s.home.team.displayName,
            away_team: s.away.team.displayName,
            home_logo: s.homeLogo,
            away_logo: s.awayLogo,
            home_seed: s.homeSeed || TEAM_TO_SEED[s.home.team.displayName],
            away_seed: s.awaySeed || TEAM_TO_SEED[s.away.team.displayName],
            status: seriesStatus,
            game_date: s.startDate,
            home_wins: s.homeWins,
            away_wins: s.awayWins,
            locked: isLocked,
            winner: s.homeWins === 4 ? s.home.team.displayName : (s.awayWins === 4 ? s.away.team.displayName : null),
            series_length: seriesOver ? (s.homeWins + s.awayWins) : null
        });

        console.log(`[NBA sync] ${s.id}: ${s.awayWins}-${s.homeWins} | ${seriesStatus}`);
    } catch (err) {
        console.error(`[NBA sync] Error on ${s.id}:`, err.message);
    }
}

async function syncNba() {
    try {
        console.log("[NBA sync] Starting fetch...");
        const { data } = await axios.get(SCOREBOARD_URL, { timeout: 15000 });
        const series = extractSeries(data);

        if (!series.length) {
            console.log("[NBA sync] No series found.");
            return;
        }

        for (const s of series) {
            await processSeries(s);
        }
        console.log(`[NBA sync] Finished. Updated ${series.length} series.`);
    } catch (err) {
        console.error("[NBA sync] Fatal Error:", err.message);
    }
}

module.exports = syncNba;