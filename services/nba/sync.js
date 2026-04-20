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
    const seriesMap = new Map();

    for (const event of data.events) {
        const comp = event.competitions?.[0];
        if (!comp) continue;

        const homeComp = comp.competitors.find(c => c.homeAway === "home");
        const awayComp = comp.competitors.find(c => c.homeAway === "away");
        if (!homeComp || !awayComp) continue;

        // 1. EXTRACT SERIES WINS VIA REGEX
        const seriesSummary = comp.series?.summary || "";
        let homeWins = 0;
        let awayWins = 0;

        if (seriesSummary) {
            const scores = seriesSummary.match(/\d+/g);
            if (scores && scores.length === 2) {
                const homeAbbr = homeComp.team.abbreviation;
                const teamLeads = seriesSummary.includes(homeAbbr);
                const tied = seriesSummary.includes("tied");

                if (tied) {
                    homeWins = parseInt(scores[0]);
                    awayWins = parseInt(scores[1]);
                } else if (teamLeads) {
                    homeWins = Math.max(scores[0], scores[1]);
                    awayWins = Math.min(scores[0], scores[1]);
                } else {
                    awayWins = Math.max(scores[0], scores[1]);
                    homeWins = Math.min(scores[0], scores[1]);
                }
            }
        }

        const headline = comp.notes?.[0]?.headline || "";
        const roundNum = getRound(headline);
        const conf = getConference(headline);
        const seriesId = makeSeriesId(roundNum, conf, { home: homeComp, away: awayComp });

        if (roundNum > 1) {
            const hName = homeComp.team.displayName;
            const aName = awayComp.team.displayName;
            if (hName === "TBD" || hName.includes("/") || aName === "TBD" || aName.includes("/")) {
                continue;
            }
        }

        // 2. DYNAMIC NEXT GAME DATE LOGIC
        const totalPlayed = homeWins + awayWins;
        let nextGameDate = event.date; // Fallback

        // Find the next scheduled game in the series array
        if (comp.series?.games && comp.series.games[totalPlayed]) {
            nextGameDate = comp.series.games[totalPlayed].date;
        }

        // Map ensures we only process each unique series once
        if (!seriesMap.has(seriesId)) {
            seriesMap.set(seriesId, {
                id: seriesId,
                headline,
                roundNum,
                conf,
                home: homeComp,
                away: awayComp,
                status: comp.status,
                startDate: nextGameDate,
                homeWins,
                awayWins
            });
        }
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

        // Round 1 Placeholders
        if (s.roundNum === 1) {
            const hSeed = TEAM_TO_SEED[homeTeamName] || s.home.seed;
            const aSeed = TEAM_TO_SEED[awayTeamName] || s.away.seed;
            if (homeTeamName === "TBD") homeTeamName = aSeed === 1 ? "8 Seed (TBD)" : "7 Seed (TBD)";
            if (awayTeamName === "TBD") awayTeamName = hSeed === 1 ? "8 Seed (TBD)" : "7 Seed (TBD)";
        }

        const isHomeTBD = !homeAbbr || homeAbbr === 'tbd' || homeAbbr.includes('/');
        const isAwayTBD = !awayAbbr || awayAbbr === 'tbd' || awayAbbr.includes('/');
        const homeLogo = isHomeTBD ? tbdLogo : `https://a.espncdn.com/i/teamlogos/nba/500/${homeAbbr}.png`;
        const awayLogo = isAwayTBD ? tbdLogo : `https://a.espncdn.com/i/teamlogos/nba/500/${awayAbbr}.png`;

        const existing = await NbaSeries.findByPk(s.id);

        const finalHomeWins = s.homeWins > 0 ? s.homeWins : (existing?.home_wins || 0);
        const finalAwayWins = s.awayWins > 0 ? s.awayWins : (existing?.away_wins || 0);
        const seriesOver = finalHomeWins === 4 || finalAwayWins === 4;

        // --- NEW SERIES-LEVEL STATUS LOGIC ---
        let seriesStatus = "STATUS_SCHEDULED";

        if (seriesOver) {
            seriesStatus = "STATUS_FINAL"; // Only Final if someone has 4 wins
        } else if (s.status.type.name === "STATUS_IN_PROGRESS") {
            seriesStatus = "STATUS_IN_PROGRESS"; // Live game happening now
        }
        // Note: If the game is 'STATUS_FINAL' but series isn't over, 
        // we leave it as 'STATUS_SCHEDULED' because we are waiting for the next game.

        const now = new Date();
        const startTime = new Date(s.startDate);
        const isLocked = existing?.locked || (now >= startTime) || (s.status.type.name !== "STATUS_SCHEDULED");

        await NbaSeries.upsert({
            id: s.id,
            round: s.roundNum,
            round_label: roundCfg.label,
            round_points_max: roundCfg.maxPoints,
            home_team: homeTeamName,
            away_team: awayTeamName,
            home_logo: homeLogo,
            away_logo: awayLogo,
            home_seed: TEAM_TO_SEED[homeTeamName] || s.home.seed || null,
            away_seed: TEAM_TO_SEED[awayTeamName] || s.away.seed || null,
            status: seriesStatus, // Updated Logic
            game_date: s.startDate,
            home_wins: finalHomeWins,
            away_wins: finalAwayWins,
            locked: isLocked,
            winner: finalHomeWins === 4 ? homeTeamName : (finalAwayWins === 4 ? awayTeamName : null),
            series_length: seriesOver ? (finalHomeWins + finalAwayWins) : null
        });

        console.log(`[NBA sync] ${s.id}: ${seriesStatus} (${finalAwayWins}-${finalHomeWins})`);
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