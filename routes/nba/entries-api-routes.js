const { NbaEntries, Users } = require("../../models/shared");
const requireAuth = require("../../middleware/Requireauth");

module.exports = function (app) {

    /**
     * GET /api/nba/entries/check/:name
     * Checks if a specific shared user has an entry for the NBA game.
     */
    app.get("/api/nba/entries/check/:name", async (req, res) => {
        try {
            const user = await Users.findOne({ where: { name: req.params.name } });
            if (!user) return res.json({ exists: false });

            const entry = await NbaEntries.findOne({ where: { user_id: user.id } });
            res.json({ exists: !!entry });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Check failed" });
        }
    });

    /**
     * POST /api/nba/entries/create
     * Enrolls the authenticated shared user into the NBA pool.
     */
    app.post("/api/nba/entries/create", requireAuth, async (req, res) => {
        try {
            // req.user is populated by your requireAuth middleware
            // Using findOrCreate to prevent duplicate entries for the same user
            const [entry, created] = await NbaEntries.findOrCreate({
                where: { user_id: req.user.id },
                defaults: {
                    entry_name: req.user.name // Defaulting entry_name to their username
                }
            });

            res.json({ success: true, created });
        } catch (err) {
            console.error("Entry creation error:", err);
            res.status(500).json({ error: "Failed to join the pool" });
        }
    });

    /**
     * GET /api/nba/entries
     * Returns all users currently enrolled in the NBA pool for standings.
     */
    app.get("/api/nba/entries", async (req, res) => {
        try {
            const entries = await NbaEntries.findAll({
                attributes: ["id", "user_id", "entry_name", "createdAt"]
            });
            res.json(entries);
        } catch (err) {
            res.status(500).json({ error: "Failed to load entries" });
        }
    });
};