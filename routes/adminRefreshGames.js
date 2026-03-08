const fetch = require("node-fetch");
const { Games } = require("../models");

const TOURNAMENT_IDS = new Set([
  "2", "3", "39", "5", "6", "9", "13", "20", "27"
]);

module.exports = function (app) {
  app.post("/api/admin/refresh-games", async (req, res) => {
    try {
      const url =
        "https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?groups=50&limit=500&dates=20260307-20260315";
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

        // Tournament filter matching sync.js
        const tournamentId = (event.tournamentId || comp.tournamentId)?.toString();
        const isTourneyGame = comp.type?.id;
        const headline = comp.notes?.[0]?.headline || "";
        const isOurTournament = TOURNAMENT_IDS.has(tournamentId);
        const isChampionshipFinal = isTourneyGame === "6" && headline.includes("- Final");

        if (!isOurTournament && !isChampionshipFinal) {
          skipped++;
          continue;
        }

        const game = await Games.findOne({ where: { id: event.id } });
        if (!game) continue; // only update games we already track

        const homeScore = Number(home?.score);
        const awayScore = Number(away?.score);
        const status = event.status.type.name;
        const game_clock = event?.status?.type?.shortDetail;

        await game.update({ home_score: homeScore, away_score: awayScore, status, game_clock });

        // Score ATS winner
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
          const favScore = game.home_team === favorite ? homeScore : awayScore;
          const dogScore = game.home_team === favorite ? awayScore : homeScore;
          const diff = favScore - dogScore;

          let atsWinner = null;
          if (diff > spread) atsWinner = favorite;
          else if (diff < spread) atsWinner = underdog;

          await game.update({ winner: atsWinner });
        }

        updated++;
      }

      res.json({ message: "Refresh complete", updated, skipped });
    } catch (err) {
      console.error("Refresh games failed", err);
      res.status(500).json({ error: "Refresh failed" });
    }
  });
};