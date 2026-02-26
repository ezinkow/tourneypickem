// routes/mypicks.js
const { Picks, Games } = require("../models");

module.exports = function (app) {
    // Get everything in Picks table
    app.get("/api/picks", async function (req, res) {
        try {
            const dbpicks = await Picks.findAll({});
            res.json(dbpicks);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to fetch picks" });
        }
    });

    app.get("/api/mypicks", async (req, res) => {
        try {
            const picks = await Picks.findAll({
                where: { name: req.query.name },
                include: [
                    {
                        model: Games,
                        attributes: [
                            "id",
                            "home_team",
                            "away_team",
                            "home_logo",
                            "away_logo",
                            "favorite",
                            "underdog",
                            "line_locked",
                            "game_clock",
                            "winner",          // ⭐ IMPORTANT
                            "status",
                            "home_score",
                            "away_score"
                        ],
                    },
                ],
                order: [["game_date", "ASC"]],
            });

            // flatten response
            const result = picks.map(p => ({
                ...p.dataValues,
                ...p.Game?.dataValues,
            }));

            res.json(result);
        } catch (err) {
            console.error("mypicks error", err);
            res.status(500).json({ error: "failed" });
        }
    });
};