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
            // Flatten so each pick has name at top level
            const flat = picks.map(p => ({
                game_id: p.game_id,
                pick: p.pick,
                missed_pick_flag: p.missed_pick_flag,
                name: p.UsersPickem.name,
            }));
            res.json(flat);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to load all picks" });
        }
    });
};