// Requiring our models
const { Names } = require("../models");


module.exports = function (app) {

    // Get everything in Names table
    app.get("/api/names", function (req, res) {
        Names.findAll({})
            .then(function (dbnames) {
                res.json(dbnames)
            })
    });

    // Find names where id = __
    app.get('/api/names/:id', function (req, res) {
        Names.findAll({
            where: {
                name: req.params.name
            }
        })
            .then(function (dbnames) {
                res.json(dbnames)
            })
    });

    //Submit name
    app.post("/api/names", function (req, res) {
        Names.create({
            real_name: req.body.real_name,
            name: req.body.name,
            email_address: req.body.email_address,
            email_opt_in: req.body.email_opt_in,
            paid_commitment: req.body.paid
        })
            .then(function (dbpicks) {
                res.json(dbpicks)
            })
    });
}