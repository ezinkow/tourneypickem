const { GamesPickem } = require("../../models/pickem");

module.exports = function (app) {

    app.get("/api/pickem/games", async (req, res) => {
        try {
            const games = await GamesPickem.findAll({
                order: [["game_date", "ASC"]]
            });
            res.json(games);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to load games" });
        }
    });

    // Find picks_display where set to visible
    app.get('/api/pickem/games/finishedAndInProgress', function (req, res) {
        GamesPickem.findAll({
            where: {
                status: ['STATUS_FINAL', 'STATUS_IN_PROGRESS', 'STATUS_HALFTIME']
            }
        })
            .then(function (dbgames) {
                res.json(dbgames)
            })
    })
};