const { UsersBracket, TokensBracket } = require("../../models/bracket");
const crypto = require("crypto");

module.exports = function (app) {

    app.get("/api/bracket/users", async (req, res) => {
        try {
            const users = await UsersBracket.findAll({
                attributes: ["id", "name", "real_name"]
            });
            res.json(users);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to load users" });
        }
    });

    app.post("/api/bracket/users/verify", async (req, res) => {
        try {
            const { name, password } = req.body;
            const user = await UsersBracket.findOne({ where: { name } });
            if (!user || user.password !== password) {
                return res.json({ success: false });
            }
            const token = crypto.randomBytes(32).toString("hex");
            const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            await TokensBracket.upsert({ token, user_id: user.id, expires });
            res.json({ success: true, token, name: user.name });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Verify failed" });
        }
    });

    app.post("/api/bracket/users/verify-token", async (req, res) => {
        try {
            const { name, token } = req.body;
            const user = await UsersBracket.findOne({ where: { name } });
            if (!user) return res.json({ success: false });
            const record = await TokensBracket.findOne({
                where: { token, user_id: user.id }
            });
            if (!record || new Date() > new Date(record.expires)) {
                return res.json({ success: false });
            }
            await record.update({
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });
            res.json({ success: true, name: user.name });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Token verify failed" });
        }
    });

    app.post("/api/bracket/users/logout", async (req, res) => {
        try {
            const { token } = req.body;
            await TokensBracket.destroy({ where: { token } });
            res.json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Logout failed" });
        }
    });

    app.post("/api/bracket/users/signup", async (req, res) => {
        try {
            const { real_name, name, password, email_address, phone } = req.body;
            const existing = await UsersBracket.findOne({ where: { name } });
            if (existing) return res.status(400).json({ error: "Username taken" });
            await UsersBracket.create({ real_name, name, password, email_address, phone });
            res.json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Signup failed" });
        }
    });

    app.post("/api/bracket/users/change-password", async (req, res) => {
        try {
            const { name, password } = req.body;
            const user = await UsersBracket.findOne({ where: { name } });
            if (!user) return res.status(404).json({ error: "User not found" });
            await user.update({ password });
            res.json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Password change failed" });
        }
    });
};