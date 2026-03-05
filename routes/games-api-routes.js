const { Games } = require("../models");
const syncGames = require("../services/sync");

module.exports = function (app) {
    app.get("/api/games", async (req, res) => {
        try {
            await syncGames();

            const games = await Games.findAll();
            res.json(games);

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to load games" });
        }
    });
};