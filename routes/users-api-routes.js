// Requiring our models
const { Users } = require("../models");


module.exports = function (app) {

    // Get everything in Users table
    app.get("/api/users", function (req, res) {
        Users.findAll({})
            .then(function (dbusers) {
                res.json(dbusers)
            })
    });

    // Find users where id = __
    app.get('/api/users/:id', function (req, res) {
        Users.findAll({
            where: {
                name: req.params.name
            }
        })
            .then(function (dbusers) {
                res.json(dbusers)
            })
    });

    // Find users where name = __
    app.get('/api/users/:name', function (req, res) {
        Users.findAll({
            where: {
                name: req.params.name
            }
        })
            .then(function (dbusers) {
                res.json(dbusers)
            })
    });

    //Submit name
    app.post("/api/users", function (req, res) {
        Users.create({
            real_name: req.body.real_name,
            name: req.body.name,
            password: req.body.password,
            email_address: req.body.email_address
        })
            .then(function (dbusers) {
                res.json(dbusers)
            })
    });

    // Verify password
    app.post("/api/users/verify", async (req, res) => {
        const { name, password } = req.body;
        try {
            const user = await Users.findOne({ where: { name } });

            if (!user) return res.status(404).json({ success: false });
            if (user.password !== password) return res.status(401).json({ success: false });

            res.json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false });
        }
    });
}