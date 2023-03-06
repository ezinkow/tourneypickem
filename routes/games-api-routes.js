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

    // Find games where game_date = __
    app.get('/api/games/:date', function (req, res) {
        console.log('req params', req.params)
        Games.findAll({
            where: {
                game_date: req.params.date
            }
        })
            .then(function (dbgames) {
                res.json(dbgames)
            })
            console.log(req.params)
    })
}

