// Requiring our models
const { Wish } = require("../models");


module.exports = function (app) {

    app.get("/api/wish", function (req, res) {
        Wish.findAll({})
            .then(function (dbWish) {
                res.json(dbWish)
            })
    })

    app.post("/api/wish", function (req, res) {
        Wish.create({
            name: req.body.name,
            wish: req.body.wish
        })
            .then(function (dbWish) {
                res.json(dbWish)
            })
    })

    app.get('/api/wish/:id', function (req, res) {
        Wish.findAll({
            where: {
                id: req.params.id
            }
        })
            .then(function (dbWish) {
                res.json(dbWish)
            })
    })

    app.delete("/api/wish/:id", function(req, res) {
        console.log("Wish ID:");
        console.log(req.params.id);
        Wish.destroy({
          where: {
            id: req.params.id
          }
        }).then(function() {
          res.end();
        });
      });

}