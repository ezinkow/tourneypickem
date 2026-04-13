const axios = require("axios");
const { NbaSeries } = require("../../models/nba");

const BRACKET_URL =
    "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?&dates=20260418-20260620";

const LOCK_BUFFER_MS = 60 * 60 * 1000; // 1 hour before tip

const ROUND_CONFIG = {
    1: { label: "First Round", maxPoints: 32, seriesCount: 8 },
    2: { label: "Second Round", maxPoints: 24, seriesCount: 4 },
    3: { label: "Conference Finals", maxPoints: 16, seriesCount: 2 },
    4: { label: "Finals", maxPoints: 8, seriesCount: 1 },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function safeDate(val) {
    if (!val) return null;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
}

/**
 * Parse a single series competitor block from ESPN.
 * Returns { team, logo, seed, wins }
 */
function parseCompetitor(comp) {
    return {
        team: comp?.team?.displayName || comp?.team?.name || null,
        logo: comp?.team?.logos?.[0]?.href || comp?.team?.logo || null,
        seed: comp?.curatedRank?.current ?? comp?.seed ?? null,
        wins: comp?.wins ?? 0,
    };
}

/**
 * Determine the next game date from a series' future games list.
 * ESPN bracket series have a `games` array; pick the first scheduled one.
 */
function nextGameDate(seriesGames = []) {
    const upcoming = seriesGames
        .filter(g => g.status?.type?.state === "pre")
        .map(g => safeDate(g.date))
        .filter(Boolean)
        .sort((a, b) => a - b);
    return upcoming[0] || null;
}

/**
 * Determine winner and series_length when status is FINAL.
 * Winner is the competitor with 4 wins.
 */
function resolveWinner(home, away, totalGames) {
    if (home.wins === 4) return { winner: home.team, series_length: totalGames };
    if (away.wins === 4) return { winner: away.team, series_length: totalGames };
    return { winner: null, series_length: null };
}

// ── Main sync ─────────────────────────────────────────────────────────────────

async function syncNba() {
    try {
        const { data } = await axios.get(BRACKET_URL, { timeout: 10000 });

        // ESPN bracket structure: data.bracket.series[]  (varies by season)
        // Also try data.seasons[0].types[0].series or data.rounds
        const rawSeries = extractSeries(data);

        if (!rawSeries || rawSeries.length === 0) {
            console.log("[NBA sync] No series found in ESPN response");
            return;
        }

        console.log(`[NBA sync] Processing ${rawSeries.length} series`);

        for (const s of rawSeries) {
            await processSeries(s);
        }

        console.log("[NBA sync] Done");
    } catch (err) {
        console.error("[NBA sync] Failed:", err.message);
    }
}

/**
 * ESPN's bracket endpoint has changed structure across seasons.
 * This tries the most common shapes and returns a flat array of series objects.
 */
function extractSeries(data) {
    if (!data?.events) return [];

    const seriesMap = new Map();

    data.events.forEach(event => {
        const comp = event.competitions?.[0];
        if (!comp) return;

        const homeComp = comp.competitors.find(c => c.homeAway === "home");
        const awayComp = comp.competitors.find(c => c.homeAway === "away");
        const headline = comp.notes?.[0]?.headline || "";

        // Grouping key: Matchup + Round (e.g., "TOR-CLE-Round 1")
        const roundPart = headline.split(' - ')[0];
        const groupKey = `${awayComp.team.abbreviation}-${homeComp.team.abbreviation}-${roundPart}`;

        if (!seriesMap.has(groupKey)) {
            seriesMap.set(groupKey, {
                id: comp.id, // Use the ESPN Competition ID (e.g., 401869187)
                headline: headline,
                home: homeComp,
                away: awayComp,
                status: comp.status,
                startDate: event.date
            });
        }
    });

    return Array.from(seriesMap.values());
}
async function processSeries(s) {
    try {
        const headline = s.headline || "";
        const homeTeam = s.home.team;
        const awayTeam = s.away.team;

        // Round Inference
        let roundNum = 1;
        if (headline.includes("Finals")) roundNum = 4;
        else if (headline.includes("Conf. Finals")) roundNum = 3;
        else if (headline.includes("2nd Round")) roundNum = 2;

        const roundCfg = ROUND_CONFIG[roundNum];

        const seriesData = {
            id: s.id, // Now storing "401869187"
            round: roundNum,
            round_label: roundCfg.label,
            round_points_max: roundCfg.maxPoints,
            home_team: homeTeam.displayName,
            away_team: awayTeam.displayName,
            // Logic to build logos (avoids broken unpkg/espn links)
            home_logo: `https://a.espncdn.com/i/teamlogos/nba/500/${homeTeam.abbreviation.toLowerCase()}.png`,
            away_logo: `https://a.espncdn.com/i/teamlogos/nba/500/${awayTeam.abbreviation.toLowerCase()}.png`,
            status: s.status.type.name,
            game_date: s.startDate,
            locked: false
        };

        await NbaSeries.upsert(seriesData);

    } catch (err) {
        console.error(`[NBA Sync] Error:`, err);
    }
}

/**
 * Fallback conference inference from team names / series context.
 * ESPN usually provides this but just in case.
 */
function inferConference(s) {
    const title = s.name || s.title || s.note || "";
    if (/east/i.test(title)) return "East";
    if (/west/i.test(title)) return "West";
    if (/final/i.test(title)) return "Finals";
    return null;
}

module.exports = syncNba;