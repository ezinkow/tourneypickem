// Requiring our models
const { PicksPickem, GamesPickem, UsersPickem } = require("../../models/pickem");

module.exports = function (app) {

    app.get("/api/pickem/picks/display", async (req, res) => {
        try {
            const { name } = req.query;
            const user = await UsersPickem.findOne({ where: { name } });
            if (!user) return res.status(404).json({ error: "User not found" });

            const picks = await PicksPickem.findAll({
                where: { user_id: user.id },
                include: [{
                    model: GamesPickem,
                    attributes: [
                        "id", "game_date", "home_team", "away_team",
                        "home_logo", "away_logo", "favorite", "underdog",
                        "fav_logo", "dog_logo", "line", "winner",
                        "status", "game_clock", "home_score", "away_score",
                        "missed_pick_flag"
                    ]
                }]
            });
            res.json(picks);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to load picks display" });
        }
    });

    // Get all users' picks for all games (group view)
    app.get("/api/pickem/picks/all", async (req, res) => {
        try {
            const picks = await PicksPickem.findAll({
                include: [
                    {
                        model: GamesPickem,
                        attributes: ["id", "game_date", "home_team", "away_team",
                            "home_logo", "away_logo", "winner", "status",
                            "home_score", "away_score", "favorite", "underdog",
                            "fav_logo", "dog_logo", "line"]
                    },
                    {
                        model: UsersPickem,
                        attributes: ["name"]
                    }
                ]
            });

            const flat = picks.map(p => ({
                game_id: p.game_id,
                pick: p.pick,
                missed_pick_flag: p.missed_pick_flag,
                name: p.UsersPickem.name,
            }));

            // Synthesize missing picks for games that have already started
            const now = new Date();
            const startedGames = await GamesPickem.findAll({
                where: {
                    status: ["STATUS_IN_PROGRESS", "STATUS_HALFTIME", "STATUS_FINAL"]
                }
            });
            const allUsers = await UsersPickem.findAll({ attributes: ["name"] });

            // Build a set of existing picks for O(1) lookup
            const existingSet = new Set(flat.map(p => `${p.name}||${p.game_id}`));

            for (const game of startedGames) {
                for (const user of allUsers) {
                    const key = `${user.name}||${game.id}`;
                    if (!existingSet.has(key)) {
                        flat.push({
                            game_id: game.id,
                            pick: game.underdog,
                            missed_pick_flag: true,
                            name: user.name,
                        });
                    }
                }
            }

            res.json(flat);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to load all picks" });
        }
    });
};