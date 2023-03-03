
// Requiring our models
const { Picks34 } = require("../models");


module.exports = function (app) {
    
    // Get everything in Picks34 table
    app.get("/api/picks34", function (req, res) {
        Picks34.findAll({})
        .then(function (dbpicks34) {
            res.json(dbpicks34)
        })
    });
    
    // Post new picks34 to picks34 table
    app.post("/api/picks34", function (req, res) {
        Picks34.create({
            name: req.body.name,
            game_id: req.body.game_id,
            pick: req.body.pick
        })
            .then(function (dbpicks34) {
                res.json(dbpicks34)
            })
    });

    // Find picks34 where id = __
    app.get('/api/picks34/:id', function (req, res) {
        Picks34.find({
            where: {
                id: req.params.id
            }
        })
            .then(function (dbpicks34) {
                res.json(dbpicks34)
            })
    })

    // Delete picks34
    app.delete("/api/picks34/:id", function (req, res) {
        Picks34.destroy({
            where: {
                id: req.params.id
            }
        }).then(function () {
            res.end();
        });
    });

}