const fetch = require("node-fetch");
const { GamesPickem } = require("../../models/pickem");

const TOURNAMENT_IDS = new Set([
    "22"
]);

async function syncPickemGames() {
    const url = "https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?groups=50&limit=306&dates=20260319-20260406";
    try {
        const response = await fetch(url);
        const data = await response.json();
        const now = new Date();

        // Fetch all existing games upfront — 1 query instead of 1 per game
        const existingGames = await GamesPickem.findAll();
        const existingMap = {};
        for (const g of existingGames) existingMap[g.id] = g;

        for (const event of data.events) {
            const comp = event?.competitions?.[0];
            if (!comp) continue;

            // 1. DATA EXTRACTION
            const headline = comp.notes?.[0]?.headline || "";
            const isTourneyGame = comp.type?.id;
            const tournamentId = (event.tournamentId || comp.tournamentId)?.toString();

            // 2. FILTER LOGIC
            const isOurTournament = TOURNAMENT_IDS.has(tournamentId);
            const isChampionshipFinal = isTourneyGame === "6" && headline.includes("- Final");
            if (!isOurTournament && !isChampionshipFinal) continue;

            // 3. TEAM NAMES
            const home = comp?.competitors?.find(c => c.homeAway === "home");
            const away = comp?.competitors?.find(c => c.homeAway === "away");

            const homeTeam = home?.team?.shortDisplayName || "TBD";
            const awayTeam = away?.team?.shortDisplayName || "TBD";
            const teamsKnown = homeTeam !== "TBD" && awayTeam !== "TBD";

            // Don't overwrite with headline — just keep TBD for unknown teams
            const homeLogo = home?.team?.logo || null;
            const awayLogo = away?.team?.logo || null;

            const homeSeed = home?.curatedRank?.current < 99 ? home.curatedRank.current : null;
            const awaySeed = away?.curatedRank?.current < 99 ? away.curatedRank.current : null;

            // 4. DATE & LOCK LOGIC
            const eventDate = new Date(event.date);
            const lineLockedTime = new Date(eventDate.getTime() - 60 * 60 * 1000);
            const status = event.status?.type?.name || "STATUS_SCHEDULED";
            const isLocked = now >= lineLockedTime;

            // 5. ODDS & LINE
            let favorite = homeTeam;
            let underdog = awayTeam;
            let currentLine = null;
            const odds = comp?.odds?.[0];
            if (odds && home && away) {
                const homeFav = odds.homeTeamOdds?.favorite == true;
                const awayFav = odds.awayTeamOdds?.favorite == true;
                if (homeFav) { favorite = homeTeam; underdog = awayTeam; }
                else if (awayFav) { favorite = awayTeam; underdog = homeTeam; }
                currentLine = odds.spread ? Math.abs(Number(odds.spread)) : null;
            }

            // 6. DERIVE LOGOS & FLAGS
            const existingGame = existingMap[event.id];
            const favLogo = favorite === homeTeam ? homeLogo : awayLogo;
            const dogLogo = underdog === homeTeam ? homeLogo : awayLogo;
            const hasOdds = !!(odds && currentLine);

            const payload = {
                id: event.id,
                game_date: event.date,
                line_locked_time: lineLockedTime,
                home_team: homeTeam !== "TBD" ? homeTeam : (existingGame?.home_team || "TBD"),
                away_team: awayTeam !== "TBD" ? awayTeam : (existingGame?.away_team || "TBD"),
                home_logo: homeLogo || existingGame?.home_logo || null,
                away_logo: awayLogo || existingGame?.away_logo || null,
                home_seed: homeSeed || existingGame?.home_seed || null,
                away_seed: awaySeed || existingGame?.away_seed || null,
                fav_logo: isLocked ? (existingGame?.fav_logo || favLogo) : (hasOdds ? favLogo : (teamsKnown ? favLogo : (existingGame?.fav_logo || favLogo))),
                dog_logo: isLocked ? (existingGame?.dog_logo || dogLogo) : (hasOdds ? dogLogo : (teamsKnown ? dogLogo : (existingGame?.dog_logo || dogLogo))),
                home_score: parseInt(home?.score || 0),
                away_score: parseInt(away?.score || 0),
                status,
                game_clock: event.status?.type?.shortDetail || "",
                winner: (() => {
                    if (status !== "STATUS_FINAL") return null;
                    const fav = existingGame?.favorite || favorite;
                    const line = existingGame?.line || currentLine;
                    if (!line) return null;
                    const favIsHome = fav === homeTeam;
                    const favScore = favIsHome ? parseInt(home.score) : parseInt(away.score);
                    const dogScore = favIsHome ? parseInt(away.score) : parseInt(home.score);
                    const diff = favScore - dogScore;
                    if (diff > line) return fav;
                    if (diff < line) return existingGame?.underdog || underdog;
                    return null;
                })(),
                line: isLocked ? (existingGame?.line || currentLine) : currentLine,
                favorite: isLocked ? (existingGame?.favorite || favorite) : (hasOdds ? favorite : (teamsKnown ? favorite : (existingGame?.favorite || favorite))),
                underdog: isLocked ? (existingGame?.underdog || underdog) : (hasOdds ? underdog : (teamsKnown ? underdog : (existingGame?.underdog || underdog))),
                selectable: homeTeam !== "TBD" && awayTeam !== "TBD"
            };

            // Skip upsert if nothing meaningful changed
            if (existingGame) {
                const noChange =
                    existingGame.status === payload.status &&
                    existingGame.home_score === payload.home_score &&
                    existingGame.away_score === payload.away_score &&
                    existingGame.winner === payload.winner &&
                    existingGame.line === payload.line &&
                    existingGame.home_team === payload.home_team &&
                    existingGame.away_team === payload.away_team &&
                    existingGame.home_seed === payload.home_seed &&
                    existingGame.away_seed === payload.away_seed;

                if (noChange) continue;
            }

            await GamesPickem.upsert(payload);
        }

        return true;
    } catch (error) {
        console.error("Sync Error:", error);
        return false;
    }
}

module.exports = syncPickemGames;