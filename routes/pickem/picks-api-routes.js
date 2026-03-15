const { PicksPickem, GamesPickem, UsersPickem } = require("../../models/pickem");

module.exports = function (app) {

    // Get picks for a user
    app.get("/api/pickem/picks", async (req, res) => {
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
                        "status", "game_clock", "home_score", "away_score"
                    ]
                }]
            });
            res.json(picks);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to load picks" });
        }
    });

    app.get("/api/pickem/mypicks", async (req, res) => {
        try {
            const { name } = req.query;
            const user = await UsersPickem.findOne({ where: { name } });
            if (!user) return res.status(404).json({ error: "User not found" });

            const picks = await PicksPickem.findAll({
                where: { user_id: user.id },
                include: [{
                    model: GamesPickem,
                    attributes: [
                        "id", "home_team", "away_team", "home_logo", "away_logo",
                        "favorite", "underdog", "line", "game_clock", "winner",
                        "status", "home_score", "away_score"
                    ],
                }],
                order: [["game_date", "DESC"]],
            });

            // Flatten so component can access game fields at top level
            const result = picks.map(p => ({
                ...p.dataValues,
                Game: p.GamesPickem?.dataValues,
                home_logo: p.GamesPickem?.home_logo,
                away_logo: p.GamesPickem?.away_logo,
                home_score: p.GamesPickem?.home_score,
                away_score: p.GamesPickem?.away_score,
                home_team: p.GamesPickem?.home_team,
                away_team: p.GamesPickem?.away_team,
            }));

            res.json(result);
        } catch (err) {
            console.error("mypicks error", err);
            res.status(500).json({ error: "failed" });
        }
    });
    
    // Bulk upsert picks
    app.post("/api/pickem/picks/bulk", async (req, res) => {
        try {
            const { name, picks } = req.body;
            const user = await UsersPickem.findOne({ where: { name } });
            if (!user) return res.status(404).json({ error: "User not found" });

            for (const p of picks) {
                await PicksPickem.upsert({
                    user_id: user.id,
                    game_id: p.game_id,
                    pick: p.pick,
                    game_date: p.game_date,
                });
            }
            res.json({ success: true, count: picks.length });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to save picks" });
        }
    });
};