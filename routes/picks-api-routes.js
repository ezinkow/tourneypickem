// Requiring our models
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

    // Create OR Overwrite pick
    app.post("/api/picks", async function (req, res) {
        try {
            const { name, game_id, pick, game_date } = req.body;

            // Check if pick already exists for this user + game
            const existingPick = await Picks.findOne({
                where: {
                    name,
                    game_id
                }
            });

            if (existingPick) {
                // Overwrite existing pick
                await existingPick.update({
                    pick,
                    game_date,
                });

                return res.json({
                    message: "Pick updated",
                    pick: existingPick
                });
            }

            // Otherwise create new pick
            const newPick = await Picks.create({
                name,
                game_id,
                pick,
                game_date
            });

            res.json({
                message: "Pick created",
                pick: newPick
            });

        } catch (err) {
            console.error("Pick submission error:", err);
            res.status(500).json({ error: "Submission failed" });
        }
    });

    //my picks
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
                            "line",
                            "game_clock",
                            "winner",
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