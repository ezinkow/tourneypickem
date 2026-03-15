const syncPickem = require("../../services/pickem/sync.js");
const lockLines = require("../../jobs/lockLines.js");

module.exports = function (app) {
    app.post("/api/pickem/admin/refresh-games", async (req, res) => {
        try {
            await syncPickem();
            await lockLines();
            res.json({ message: "Pickem refresh complete" });
        } catch (err) {
            console.error("Pickem refresh failed", err);
            res.status(500).json({ error: "Refresh failed" });
        }
    });
};