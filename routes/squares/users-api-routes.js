const { UsersSquares, TokensSquares } = require("../../models/squares");
const crypto = require("crypto");

module.exports = function (app) {

    app.get("/api/squares/users", async (req, res) => {
        try {
            const users = await UsersSquares.findAll({
                attributes: ["id", "name", "email", "phone", "paid"],
                order: [["name", "ASC"]]
            });
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: "Failed to load users" });
        }
    });

    app.post("/api/squares/users/signup", async (req, res) => {
        try {
            const { name, email, phone, password } = req.body;
            if (!name) return res.status(400).json({ error: "Name required" });
            if (!password) return res.status(400).json({ error: "Password required" });
            const existing = await UsersSquares.findOne({ where: { name } });
            if (existing) return res.status(400).json({ error: "Name already taken" });
            await UsersSquares.create({ name, email, phone, password });
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ error: "Signup failed" });
        }
    });

    app.post("/api/squares/users/verify", async (req, res) => {
        try {
            const { name, password } = req.body;
            const user = await UsersSquares.findOne({ where: { name } });
            if (!user || user.password !== password) return res.json({ success: false });
            const token = crypto.randomBytes(32).toString("hex");
            const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            await TokensSquares.upsert({ token, user_id: user.id, expires });
            res.json({ success: true, token, name: user.name });
        } catch (err) {
            res.status(500).json({ error: "Verify failed" });
        }
    });

    app.post("/api/squares/users/verify-token", async (req, res) => {
        try {
            const { name, token } = req.body;
            const user = await UsersSquares.findOne({ where: { name } });
            if (!user) return res.json({ success: false });
            const record = await TokensSquares.findOne({ where: { token, user_id: user.id } });
            if (!record || new Date() > new Date(record.expires)) return res.json({ success: false });
            await record.update({ expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
            res.json({ success: true, name: user.name });
        } catch (err) {
            res.status(500).json({ error: "Token verify failed" });
        }
    });

    app.post("/api/squares/users/logout", async (req, res) => {
        try {
            const { token } = req.body;
            await TokensSquares.destroy({ where: { token } });
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ error: "Logout failed" });
        }
    });

    app.post("/api/squares/users/change-password", async (req, res) => {
        try {
            const { email, newPassword } = req.body;
            if (!email || !newPassword) return res.status(400).json({ error: "Email and password required" });
            const user = await UsersSquares.findOne({ where: { email } });
            if (!user) return res.status(404).json({ error: "No account found with that email" });
            await user.update({ password: newPassword });
            res.json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Password change failed" });
        }
    });
};