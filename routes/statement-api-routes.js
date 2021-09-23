// Requiring our models
const { Statement } = require("../models");


module.exports = function (app) {

    app.get("/api/statement", function (req, res) {
        Statement.findAll({})
            .then(function (dbStatement) {
                res.json(dbStatement)
            })
    })

    app.post("/api/statement", function (req, res) {
        console.log('req body', req.body.when)
        Statement.create({
            when: req.body.when,
            statement: req.body.statement
        })
            .then(function (dbStatement) {
                res.json(dbStatement)
            })
    })

    app.get('/api/statement/:id', function (req, res) {
        Statement.findAll({
            where: {
                id: req.params.id
            }
        })
            .then(function (dbStatement) {
                res.json(dbStatement)
            })
    })

    app.delete("/api/statement/:id", function(req, res) {
        console.log("Statement ID:");
        console.log(req.params.id);
        Statement.destroy({
          where: {
            id: req.params.id
          }
        }).then(function() {
          res.end();
        });
      });

}