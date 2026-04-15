const axios = require("axios");
const db = require("../../models");

const SCOREBOARD_URL = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=20260418-20260620";

const ROUND_CONFIG = {
    1: { label: "First Round", maxPoints: 32 },
    2: { label: "Second Round", maxPoints: 24 },
    3: { label: "Conference Finals", maxPoints: 16 },
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
    if (headline.includes("Finals") && !headline.includes("Conf.")) return 4;
    if (headline.includes("Conf. Finals")) return 3;
    if (headline.includes("2nd Round")) return 2;
    return 1;
}

// Stable ID that is identical for every game in the same series
function makeSeriesId(roundNum, awayAbbr, homeAbbr) {
    const teams = [awayAbbr, homeAbbr].sort();
    return `R${roundNum}-${teams[0]}-${teams[1]}`;
}

function extractSeries(data) {
    if (!data?.events) return [];

    const seriesMap = new Map();

    for (const event of data.events) {
        const comp = event.competitions?.[0];
        if (!comp) continue;

        const homeComp = comp.competitors.find(c => c.homeAway === "home");
        const awayComp = comp.competitors.find(c => c.homeAway === "away");
        if (!homeComp || !awayComp) continue;

        const headline = comp.notes?.[0]?.headline || "";
        const roundNum = getRound(headline);
        const seriesId = makeSeriesId(roundNum, awayComp.team.abbreviation, homeComp.team.abbreviation);

        // Skip if we already have this series — only keep Game 1 (first event seen)
        if (seriesMap.has(seriesId)) continue;

        seriesMap.set(seriesId, {
            id: seriesId,
            headline,
            roundNum,
            home: homeComp,
            away: awayComp,
            status: comp.status,
            startDate: event.date,
        });
    }

    console.log(`[NBA sync] Unique series found: ${seriesMap.size}`);
    return Array.from(seriesMap.values());
}

async function processSeries(s) {
    const { NbaSeries } = db;
    try {
        const roundCfg = ROUND_CONFIG[s.roundNum];
        const tbdLogo = "https://a.espncdn.com/i/teamlogos/leagues/500/nba.png";

        let homeTeamName = s.home.team.displayName;
        let awayTeamName = s.away.team.displayName;
        const homeAbbr = s.home.team.abbreviation?.toLowerCase();
        const awayAbbr = s.away.team.abbreviation?.toLowerCase();
        let homeLogo = `https://a.espncdn.com/i/teamlogos/nba/500/${homeAbbr}.png`;
        let awayLogo = `https://a.espncdn.com/i/teamlogos/nba/500/${awayAbbr}.png`;

        if (homeTeamName === "TBD" || homeTeamName.includes("/")) {
            if (homeTeamName === "TBD") homeTeamName = "Play-in 8 seed";
            homeLogo = tbdLogo;
        }
        if (awayTeamName === "TBD" || awayTeamName.includes("/")) {
            if (awayTeamName === "TBD") awayTeamName = "Play-in 8 seed";
            awayLogo = tbdLogo;
        }

        const existing = await NbaSeries.findByPk(s.id);

        if (existing) {
            // Series already in DB — only update live fields, never recreate
            const homeWins = parseInt(s.home.wins) || 0;
            const awayWins = parseInt(s.away.wins) || 0;

            const updates = {
                status: s.status.type.name,
                game_date: s.startDate,
                home_wins: homeWins,
                away_wins: awayWins,
            };

            // Set winner + series length when complete
            if (s.status.type.name === "STATUS_FINAL" && !existing.winner) {
                if (homeWins === 4) {
                    updates.winner = homeTeamName;
                    updates.series_length = homeWins + awayWins;
                } else if (awayWins === 4) {
                    updates.winner = awayTeamName;
                    updates.series_length = homeWins + awayWins;
                }
            }

            // Lock at tip-off (game_date = Game 1 start)
            if (!existing.locked && new Date() >= new Date(s.startDate)) {
                updates.locked = true;
                console.log(`[NBA sync] Locked: ${s.id}`);
            }

            await existing.update(updates);
            console.log(`[NBA sync] Updated: ${s.id} (${awayTeamName} vs ${homeTeamName})`);

        } else {
            // New series — insert once
            await NbaSeries.create({
                id: s.id,
                round: s.roundNum,
                round_label: roundCfg.label,
                round_points_max: roundCfg.maxPoints,
                home_team: homeTeamName,
                away_team: awayTeamName,
                home_logo: homeLogo,
                away_logo: awayLogo,
                home_seed: TEAM_TO_SEED[homeTeamName] || null,
                away_seed: TEAM_TO_SEED[awayTeamName] || null,
                home_wins: 0,
                away_wins: 0,
                status: s.status.type.name,
                game_date: s.startDate,
                locked: false,
            });
            console.log(`[NBA sync] Created: ${s.id} (${awayTeamName} vs ${homeTeamName})`);
        }

    } catch (err) {
        console.error(`[NBA sync] Error on ${s.id}:`, err.message);
    }
}

async function syncNba() {
    try {
        const { data } = await axios.get(SCOREBOARD_URL, { timeout: 10000 });
        const series = extractSeries(data);

        if (!series.length) {
            console.log("[NBA sync] No series found");
            return;
        }

        for (const s of series) {
            await processSeries(s);
        }

        console.log(`[NBA sync] Done — ${series.length} series processed`);
    } catch (err) {
        console.error("[NBA sync] Failed:", err.message);
    }
}

module.exports = syncNba;