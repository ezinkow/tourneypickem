const axios = require("axios");
const db = require("../../models");

const BRACKET_URL = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?&dates=20260418-20260620";

const ROUND_CONFIG = {
    1: { label: "First Round", maxPoints: 32 },
    2: { label: "Second Round", maxPoints: 24 },
    3: { label: "Conference Finals", maxPoints: 16 },
    4: { label: "Finals", maxPoints: 8 },
};

const TEAM_TO_SEED = {
    // East
    "Detroit Pistons": 1, "Boston Celtics": 2, "New York Knicks": 3, "Cleveland Cavaliers": 4,
    "Toronto Raptors": 5, "Atlanta Hawks": 6, "Philadelphia 76ers": 7, "Orlando Magic": 7,
    // West
    "Oklahoma City Thunder": 1, "San Antonio Spurs": 2, "Denver Nuggets": 3, "Los Angeles Lakers": 4,
    "Houston Rockets": 5, "Minnesota Timberwolves": 6, "Phoenix Suns": 7, "Portland Trail Blazers": 7,
    // Play-in Placeholder
    "Play-in 8 seed": 8
};

async function syncNba() {
    try {
        const { data } = await axios.get(BRACKET_URL, { timeout: 10000 });
        const rawSeries = extractSeries(data);

        if (!rawSeries || rawSeries.length === 0) {
            console.log("[NBA sync] No series found in ESPN response");
            return;
        }

        // CRITICAL FIX: Use for...of loop to avoid 'max_user_connections' errors on Heroku
        for (const s of rawSeries) {
            await processSeries(s);
        }

        console.log(`[NBA sync] Done. Synced ${rawSeries.length} unique series.`);
    } catch (err) {
        console.error("[NBA sync] Failed:", err.message);
    }
}

function extractSeries(data) {
    if (!data?.events) return [];
    const seriesMap = new Map();

    data.events.forEach(event => {
        const comp = event.competitions?.[0];
        if (!comp) return;

        const homeComp = comp.competitors.find(c => c.homeAway === "home");
        const awayComp = comp.competitors.find(c => c.homeAway === "away");
        const headline = comp.notes?.[0]?.headline || "";

        const roundPart = headline.split(' - ')[0];
        const groupKey = `${awayComp.team.abbreviation}-${homeComp.team.abbreviation}-${roundPart}`;

        if (!seriesMap.has(groupKey)) {
            seriesMap.set(groupKey, {
                id: comp.id,
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
    const { NbaSeries } = db;

    try {
        const headline = s.headline || "";
        let homeTeamName = s.home.team.displayName;
        let awayTeamName = s.away.team.displayName;
        let homeLogo = `https://a.espncdn.com/i/teamlogos/nba/500/${s.home.team.abbreviation?.toLowerCase()}.png`;
        let awayLogo = `https://a.espncdn.com/i/teamlogos/nba/500/${s.away.team.abbreviation?.toLowerCase()}.png`;

        // Determine Round
        let roundNum = 1;
        if (headline.includes("Finals") && !headline.includes("Conf.")) roundNum = 4;
        else if (headline.includes("Conf. Finals")) roundNum = 3;
        else if (headline.includes("2nd Round")) roundNum = 2;

        const roundCfg = ROUND_CONFIG[roundNum];

        // TBD / Play-in Logic
        if (roundNum === 1) {
            if (homeTeamName === "TBD") {
                homeTeamName = "Play-in 8 seed";
                homeLogo = "https://a.espncdn.com/i/teamlogos/leagues/500/nba.png";
            }
            if (awayTeamName === "TBD") {
                awayTeamName = "Play-in 8 seed";
                awayLogo = "https://a.espncdn.com/i/teamlogos/leagues/500/nba.png";
            }
        }

        await NbaSeries.upsert({
            id: s.id,
            round: roundNum,
            round_label: roundCfg.label,
            round_points_max: roundCfg.maxPoints,
            home_team: homeTeamName,
            away_team: awayTeamName,
            home_logo: homeLogo,
            away_logo: awayLogo,
            home_seed: TEAM_TO_SEED[homeTeamName] || null,
            away_seed: TEAM_TO_SEED[awayTeamName] || null,
            status: s.status.type.name,
            game_date: s.startDate,
            locked: false
        });

    } catch (err) {
        console.error(`[NBA Sync] Error processing series ${s.id}:`, err.message);
    }
}

module.exports = syncNba;