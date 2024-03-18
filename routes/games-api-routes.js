// Requiring our models
const { Games } = require("../models");


module.exports = function (app) {

    // Get everything in Games table
    app.get("/api/games", function (req, res) {
        Games.findAll({})
            .then(function (dbgames) {
                res.json(dbgames)
            })
    });

    // Get game status
    app.get('/api/games/:status', function (req, res) {
        console.log('req params', req.params)
        Games.findAll({
            where: {
                status: req.params.status
            }
        })
            .then(function (dbgames) {
                res.json(dbgames)
            })
            console.log(req.params)
    })
}

