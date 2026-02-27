const fetch = require("node-fetch");
const { Games } = require("../models");

const CONFERENCES = new Set([
  "4",   // Big East
  "7",   // Big Ten
  "23",  // SEC
  "62",  // American
  "2",   // ACC
  "8",   // Big 12
  "44",  // Mountain West
  "3",   // A10
  "11"   // Conference USA
]);

module.exports = function (app) {

  app.post("/api/admin/refresh-games", async (req, res) => {
    try {

      const url =
        "https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?groups=50&limit=500&dates=20260223-20260305";

      const response = await fetch(url);
      const data = await response.json();

      let updated = 0;
      let skipped = 0;

      for (const event of data.events) {
        const comp = event?.competitions?.[0];
        if (!comp) continue;

        const home = comp.competitors.find(c => c.homeAway === "home");
        const away = comp.competitors.find(c => c.homeAway === "away");
        if (!home || !away) continue;

        // ⭐ conference filter (same as /api/games)
        const homeConf = home?.team?.conferenceId?.toString();
        const awayConf = away?.team?.conferenceId?.toString();

        if (!CONFERENCES.has(homeConf) && !CONFERENCES.has(awayConf)) {
          skipped++;
          continue;
        }

        const game = await Games.findOne({ where: { id: event.id } });
        if (!game) continue; // only update games we already track

        const homeScore = Number(home?.score);
        const awayScore = Number(away?.score);
        const status = event.status.type.name;
        const game_clock = event?.status?.type?.shortDetail

        await game.update({
          home_score: homeScore,
          away_score: awayScore,
          status,
          game_clock
        });

        // -------- Score ATS winner --------
        if (
          game.line &&
          !game.winner &&
          !isNaN(homeScore) &&
          !isNaN(awayScore) &&
          status === "STATUS_FINAL"
        ) {
          const favorite = game.locked_favorite || game.favorite;
          const underdog = game.locked_underdog || game.underdog;
          const spread = Number(game.line);

          let favScore =
            game.home_team === favorite ? homeScore : awayScore;

          let dogScore =
            game.home_team === favorite ? awayScore : homeScore;

          const diff = favScore - dogScore;

          let atsWinner = null;
          if (diff > spread) atsWinner = favorite;
          else if (diff < spread) atsWinner = underdog;

          await game.update({ winner: atsWinner });
        }

        updated++;
      }

      res.json({
        message: "Refresh complete",
        updated,
        skipped
      });

    } catch (err) {
      console.error("Refresh games failed", err);
      res.status(500).json({ error: "Refresh failed" });
    }
  });
};