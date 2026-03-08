// adminRefreshGames.js
const syncGames = require("../services/sync.js");
const lockLines = require("../jobs/lockLines");

module.exports = function (app) {
  app.post("/api/admin/refresh-games", async (req, res) => {
    try {
      await syncGames();
      await lockLines();
      res.json({ message: "Refresh complete" });
    } catch (err) {
      console.error("Refresh games failed", err);
      res.status(500).json({ error: "Refresh failed" });
    }
  });
};