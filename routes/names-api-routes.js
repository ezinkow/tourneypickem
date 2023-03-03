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
    })
}