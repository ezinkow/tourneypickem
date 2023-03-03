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
    app.get('/api/games/game_date', function (req, res) {
        Games.findAll({
            where: {
                game_date: req.params.game_date
            }
        })
            .then(function (dbgames) {
                res.json(dbgames)
            })
    })
}

