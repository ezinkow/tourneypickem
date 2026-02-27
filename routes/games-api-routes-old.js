const fetch = require("node-fetch");
const { Games } = require("../models");

const CONFERENCES = new Set(["4", "7", "23", "62", "2", "8", "44", "3", "11"]);

module.exports = function (app) {
    app.get("/api/games", async (req, res) => {
        try {
            // Updated date range to include current day for status updates
            const url = "https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?groups=50&limit=200";
            const response = await fetch(url);
            const data = await response.json();
            const now = new Date();
            const gamesList = [];

            for (const event of data.events) {
                const comp = event?.competitions?.[0];
                if (!comp) continue;

                const home = comp.competitors.find(c => c.homeAway === "home");
                const away = comp.competitors.find(c => c.homeAway === "away");
                const homeConf = home.team.conferenceId?.toString();
                const awayConf = away.team.conferenceId?.toString();

                if (!CONFERENCES.has(homeConf) && !CONFERENCES.has(awayConf)) continue;

                const gameStart = new Date(event.date);
                const status = event.status.type.name;
                const homeScore = parseInt(home.score);
                const awayScore = parseInt(away.score);

                // Determine Winner (only if final)
                let winner = null;
                if (status === "STATUS_FINAL") {
                    winner = homeScore > awayScore ? home.team.displayName : away.team.displayName;
                }

                let favorite = ''
                let underdog = ''
                let fav_logo = ''
                let dog_logo = ''

                // Logic for Odds/Favorite
                const odds = comp.odds?.[0];
                if (odds.homeTeamOdds.favorite == 'true') {
                    favorite = home.team.shortDisplayName;
                    underdog = away.team.shortDisplayName;
                    fav_logo = home.team.logo;
                    dog_logo = away.team.logo;
                } else if (odds.awayTeamOdds.favorite == 'true'){
                    favorite = away.team.shortDisplayName;
                    underdog = home.team.shortDisplayName;
                    fav_logo = away.team.logo;
                    dog_logo = home.team.logo;
                }
                let currentLine = odds.spread;
                let spread_details = odds.details;

                if (odds?.details && odds?.spread !== undefined) {
                    const favAbbr = odds.details.split(" ")[0];
                    if (away.team.abbreviation === favAbbr) {
                        favorite = away.team.displayName;
                        underdog = home.team.displayName;
                        fav_logo = away.team.logo;
                        dog_logo = home.team.logo;
                    }
                    currentLine = Math.abs(Number(odds.spread));
                }

                // DB SYNC: Upsert everything
                const [gameRecord] = await Games.upsert({
                    id: event.id,
                    game_date: event.date,
                    home_team: home.team.shortDisplayName,
                    away_team: away.team.shortDisplayName,
                    home_logo: home.team.logo,
                    away_logo: away.team.logo,
                    home_score: homeScore,
                    away_score: awayScore,
                    status: status,
                    game_clock: event.status.type.shortDetail,
                    winner: winner,
                    // If not locked yet, keep updating these
                    favorite: favorite,
                    underdog: underdog,
                    fav_logo: fav_logo,
                    dog_logo: dog_logo
                });

                // LOCK LOGIC: 60 mins before or once game starts
                const lockThreshold = new Date(gameStart.getTime() - 60 * 60 * 1000);
                const fullRecord = await Games.findByPk(event.id);

                if (now >= lockThreshold && fullRecord.line_locked === null && currentLine !== null) {
                    await fullRecord.update({
                        line: currentLine,
                        locked_favorite: favorite,
                        locked_underdog: underdog,
                        locked_fav_logo: fav_logo,
                        locked_dog_logo: dog_logo,
                        line_locked_time: now
                    });
                }

                // Only push to the "Picks" UI if the game hasn't started
                if (now < gameStart) {
                    gamesList.push(fullRecord);
                }
            }
            res.json(gamesList);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Sync failed" });
        }
    });
};