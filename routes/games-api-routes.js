// routes/games.js
const fetch = require("node-fetch");
const { Games } = require("../models");

const CONFERENCES = new Set([
    "4", "7", "23", "62", "2", "8", "44", "3", "11"
]);

function formatTimeET(date) {
    return new Date(date).toLocaleTimeString("en-US", {
        timeZone: "America/New_York",
        hour: "numeric",
        minute: "2-digit"
    });
}

module.exports = function (app) {
    app.get("/api/games", async (req, res) => {
        try {
            const url = "https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?groups=50&limit=200&dates=20260223-20260305";

            const response = await fetch(url);
            const data = await response.json();

            const now = new Date();
            const games = [];

            for (const event of data.events) {
                const comp = event?.competitions?.[0];
                if (!comp) continue;

                const home = comp.competitors.find(c => c.homeAway === "home");
                const away = comp.competitors.find(c => c.homeAway === "away");
                if (!home || !away) continue;

                const homeConf = home.team.conferenceId?.toString();
                const awayConf = away.team.conferenceId?.toString();

                if (!CONFERENCES.has(homeConf) && !CONFERENCES.has(awayConf)) continue;

                const gameStart = new Date(event.date);
                // Define the lock window (60 mins before tip)
                const lineLockTime = new Date(gameStart.getTime() - 60 * 60 * 1000);
                const status = event.status.type.name;

                // Skip live/finished games for the Picks UI
                if (now >= gameStart) continue;

                const odds = comp.odds?.[0];
                const home_team = home.team.displayName;
                const away_team = away.team.displayName;
                let favorite = home_team;
                let underdog = away_team;
                let fav_logo = home.team.logo;
                let dog_logo = away.team.logo;
                let line = null;

                if (odds?.details && odds?.spread !== undefined) {
                    const favAbbr = odds.details.split(" ")[0];
                    if (away.team.abbreviation === favAbbr) {
                        favorite = away_team;
                        underdog = home_team;
                        fav_logo = away.team.logo;
                        dog_logo = home.team.logo;
                    }
                    line = Math.abs(Number(odds.spread));
                }

                /* ---------- DB SYNC & LOCK LOGIC ---------- */
                // 1. Find or create the game record
                const [gameRecord, created] = await Games.findOrCreate({
                    where: { id: event.id },
                    defaults: {
                        game_date: event.date,
                        line_locked_time: lineLockTime,
                        home_team,
                        away_team,
                        favorite,
                        underdog,
                        home_logo: home.team.logo,
                        away_logo: away.team.logo,
                        fav_logo,
                        dog_logo,
                        status
                    }
                });

                // 2. FOOLPROOF LOCK: If we are past the lock time AND it's not locked yet
                if (now >= lineLockTime && gameRecord.line_locked === null && line !== null) {
                    await gameRecord.update({
                        line_locked: line,
                        locked_favorite: favorite,
                        locked_underdog: underdog,
                        locked_fav_logo: fav_logo,
                        locked_dog_logo: dog_logo
                    });
                    // Update our local object so the UI gets the locked version immediately
                    gameRecord.line_locked = line;
                }

                games.push({
                    id: event.id,
                    game_date: event.date,
                    game_locked_time: formatTimeET(event.date),
                    favorite: gameRecord.locked_favorite || favorite,
                    underdog: gameRecord.locked_underdog || underdog,
                    home_logo: home.team.logo,
                    away_logo: away.team.logo,
                    fav_logo: gameRecord.locked_fav_logo || fav_logo,
                    dog_logo: gameRecord.locked_dog_logo || dog_logo,
                    line: gameRecord.line_locked ?? line,
                    line_is_locked: gameRecord.line_locked !== null,
                    conference_id: homeConf || awayConf
                });
            }

            games.sort((a, b) => new Date(a.game_date) - new Date(b.game_date));
            res.json(games);
        } catch (err) {
            console.error("API error", err);
            res.status(500).json({ error: "Failed to fetch games" });
        }
    });
};