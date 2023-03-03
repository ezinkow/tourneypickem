// Requiring our models
const { Picks } = require("../models");


module.exports = function (app) {

    // Get everything in Picks table
    app.get("/api/picks", function (req, res) {
        Picks.findAll({})
            .then(function (dbpicks) {
                res.json(dbpicks)
            })
    });

    // Post new picks to picks table
    app.post("/api/picks", function (req, res) {
        Picks.create({
            name: req.body.name,
            game_id: req.body.game_id,
            pick: req.body.pick
        })
            .then(function (dbpicks) {
                res.json(dbpicks)
            })
    });

    // Find picks where id = __
    app.get('/api/picks/:id', function (req, res) {
        Games.findAll({
            where: {
                id: req.params.id
            }
        })
            .then(function (dbpicks) {
                res.json(dbpicks)
            })
    })

    // Delete picks
    app.delete("/api/picks/:id", function (req, res) {
        Picks.destroy({
            where: {
                id: req.params.id
            }
        }).then(function () {
            res.end();
        });
    });

}