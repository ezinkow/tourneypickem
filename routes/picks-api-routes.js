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
            pick: req.body.pick,
            game_date: req.body.game_date
        })
            .then(function (dbpicks) {
                res.json(dbpicks)
            })
    });

    // Find picks where set to visible
        app.get('/api/picks/:make_visible', function (req, res) {
        console.log('req params', req.params)
        Picks.findAll({
            where: {
                game_date: req.params.date
            }
        })
            .then(function (dbpicks) {
                res.json(dbpicks)
            })
        console.log(req.params)
    })

    // // Find picks where id = __
    // app.get('/api/picks/:id', function (req, res) {
    //     Picks.findAll({}
    //     )
    //         .then(function (dbpicks) {
    //             res.json(dbpicks)
    //         })
    //     console.log(req.params)
    // })



}