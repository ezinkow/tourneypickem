// 1. Import the NBA database object from its sub-folder index
const nbaDb = require("../../models");
// 2. Destructure the models from that specific object
const { NbaPicks, NbaSeries, NbaEntries } = nbaDb;

// 3. Import Users from the shared folder
const sharedDb = require("../../models/shared");
const { Users } = sharedDb;

// 4. Match your exact case-sensitive filename for Heroku
const requireAuth = require("../../middleware/Requireauth");

const ROUND_CONFIG = {
    1: { maxPoints: 32 },
    2: { maxPoints: 24 },
    3: { maxPoints: 16 },
    4: { maxPoints: 8 },
};

module.exports = function (app) {

    // GET /api/nba/picks?name=X
    app.get("/api/nba/picks", async (req, res) => {
        try {
            const { name } = req.query;

            if (!name || name === "undefined" || name === "SELECT YOUR NAME") {
                return res.json([]);
            }

            const entry = await NbaEntries.findOne({ where: { entry_name: name } });

            if (!entry) return res.json([]);

            const picks = await NbaPicks.findAll({
                where: { user_id: entry.user_id },
                include: [{
                    model: NbaSeries,
                    as: 'series',
                    attributes: [
                        "id", "round", "round_label", "round_points_max",
                        "home_team", "away_team", "home_logo", "away_logo",
                        "home_seed", "away_seed", "home_wins", "away_wins",
                        "winner", "series_length", "status", "locked",
                    ],
                }],
            });
            res.json(picks);
        } catch (err) {
            console.error("GET Picks Error:", err);
            res.status(500).json({ error: "Failed to load picks" });
        }
    });

    // GET /api/nba/picks/all (Group Picks Matrix)
    app.get("/api/nba/picks/all", async (req, res) => {
        try {
            const picks = await NbaPicks.findAll({
                include: [
                    {
                        model: NbaSeries,
                        as: 'series',
                        attributes: [
                            "id", "round", "round_label", "locked",
                            "home_team", "away_team", "home_seed", "away_seed",
                            "home_wins", "away_wins", "winner", "series_length", "status",
                        ],
                    },
                ],
            });

            const entries = await NbaEntries.findAll();
            const entryMap = {};
            for (const e of entries) entryMap[e.user_id] = e.entry_name;

            const result = picks
                .filter(p => p.series?.locked)
                .map(p => ({
                    user_id: p.user_id,
                    entry_name: entryMap[p.user_id] || "Unknown",
                    series_id: p.series_id,
                    pick: p.pick,
                    confidence: p.confidence,
                    series_length_guess: p.series_length_guess,
                    series: p.series,
                }));

            res.json(result);
        } catch (err) {
            console.error("GET All Picks Error:", err);
            res.status(500).json({ error: "Failed to load group picks" });
        }
    });

    // POST /api/nba/picks/bulk
    app.post("/api/nba/picks/bulk", requireAuth, async (req, res) => {
        try {
            const { picks } = req.body;
            if (!Array.isArray(picks) || picks.length === 0) {
                return res.status(400).json({ error: "No picks provided" });
            }

            const entry = await NbaEntries.findOne({ where: { user_id: req.user.id } });
            if (!entry) return res.status(403).json({ error: "Join the pool first!" });

            const seriesIds = picks.map(p => p.series_id);
            const seriesList = await NbaSeries.findAll({ where: { id: seriesIds } });

            const round = seriesList[0]?.round;
            const config = ROUND_CONFIG[round];
            if (!config) return res.status(400).json({ error: "Invalid round" });

            const totalSubmittedPoints = picks.reduce((sum, p) => sum + (parseInt(p.confidence) || 0), 0);

            if (totalSubmittedPoints > config.maxPoints) {
                return res.status(400).json({
                    error: `Total points (${totalSubmittedPoints}) exceeds Round Max (${config.maxPoints})`
                });
            }

            const hasInvalidRange = picks.some(p => p.confidence < 1 || p.confidence > 10);
            if (hasInvalidRange) {
                return res.status(400).json({ error: "Confidence points must be between 1 and 10" });
            }

            for (const p of picks) {
                await NbaPicks.upsert({
                    user_id: req.user.id,
                    series_id: p.series_id,
                    pick: p.pick,
                    confidence: parseInt(p.confidence),
                    series_length_guess: p.series_length_guess ? parseInt(p.series_length_guess) : null,
                });
            }

            res.json({ success: true, totalPoints: totalSubmittedPoints });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to save picks" });
        }
    });
};