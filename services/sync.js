const fetch = require("node-fetch");
const { Games } = require("../models");

const TOURNAMENT_IDS = new Set([
    "2", "3", "39", "5", "6", "9", "13", "20", "27"
]);

async function syncGames() {
    const url = "https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?groups=50&limit=304&dates=20260307-20260315";

    try {
        const response = await fetch(url);
        const data = await response.json();
        const now = new Date();

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

            // 3. TEAM NAMES (Fixed Fallback Logic)
            const home = comp?.competitors?.find(c => c.homeAway === "home");
            const away = comp?.competitors?.find(c => c.homeAway === "away");

            let homeTeam = home?.team?.shortDisplayName || "TBD";
            let awayTeam = away?.team?.shortDisplayName || "TBD";

            const teamsKnown = homeTeam !== "TBD" && awayTeam !== "TBD";
            console.log('teams known', teamsKnown)

            /**
             * If the team name is "TBD", use the tournament headline as the name.
             * This ensures the matchup shows the tournament info instead of just "TBD"
             */
            if (homeTeam === "TBD" && headline) homeTeam = headline;
            if (awayTeam === "TBD" && headline) awayTeam = headline;

            const homeLogo = home?.team?.logo || null;
            const awayLogo = away?.team?.logo || null;
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
                if (odds.homeTeamOdds?.favorite === "true") {
                    favorite = homeTeam; underdog = awayTeam;
                } else if (odds.awayTeamOdds?.favorite === "true") {
                    favorite = awayTeam; underdog = homeTeam;
                }
                currentLine = odds.spread ? Math.abs(Number(odds.spread)) : null;
            }

            // 6. DB UPSERT
            const existingGame = await Games.findByPk(event.id);

            // After odds logic, derive fav/dog logos
            const favLogo = favorite === homeTeam ? homeLogo : awayLogo;
            const dogLogo = underdog === homeTeam ? homeLogo : awayLogo;

            await Games.upsert({
                id: event.id,
                game_date: event.date,
                line_locked_time: lineLockedTime,
                home_team: homeTeam,
                away_team: awayTeam,
                home_logo: homeLogo,
                away_logo: awayLogo,
                fav_logo: isLocked ? (existingGame?.fav_logo || favLogo) : favLogo,
                dog_logo: isLocked ? (existingGame?.dog_logo || dogLogo) : dogLogo,
                home_score: parseInt(home?.score || 0),
                away_score: parseInt(away?.score || 0),
                status,
                game_clock: event.status?.type?.shortDetail || "",
                winner: status === "STATUS_FINAL"
                    ? (parseInt(home.score) > parseInt(away.score) ? homeTeam : awayTeam)
                    : null,
                line: isLocked ? (existingGame?.line || currentLine) : currentLine,
                favorite: isLocked ? (existingGame?.favorite || favorite) : favorite,
                underdog: isLocked ? (existingGame?.underdog || underdog) : underdog,
                selectable: teamsKnown
            });
        }
        return true;
    } catch (error) {
        console.error("Sync Error:", error);
        return false;
    }
}

module.exports = syncGames;