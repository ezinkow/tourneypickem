// Requiring our models
const {Question} = require("../models");


module.exports = function (app) {

    app.get("/api/questions", function (req, res) {
        Question.findAll({})
            .then(function (dbQuestion) {
                res.json(dbQuestion)
            })
    })

    app.post("/api/questions", function (req, res) {
        Question.create({
            name: req.body.name,
            category: req.body.category,
            question: req.body.question
        })
            .then(function (dbQuestion) {
                res.json(dbQuestion)
            })
    })

}