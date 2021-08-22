// Requiring our models
const {Query} = require("../models");


module.exports = function (app) {

    app.get("/api/queries", function (req, res) {
        Query.findAll({})
            .then(function (dbQuery) {
                res.json(dbQuery)
            })
    })

    app.post("/api/queries", function (req, res) {
        Query.create({
            name: req.body.name,
            category: req.body.category,
            question: req.body.question
        })
            .then(function (dbQuery) {
                res.json(dbQuery)
            })
    })

}