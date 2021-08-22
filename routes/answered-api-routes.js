// Requiring our models
const {Answered} = require("../models");


module.exports = function (app) {

    app.get("/api/answered", function (req, res) {
        Answered.findAll({})
            .then(function (dbAnswered) {
                res.json(dbAnswered)
            })
    })

    app.post("/api/answered", function (req, res) {
        Answered.create({
            name: req.body.name,
            category: req.body.category,
            question: req.body.question,
            answer: req.body.answer,
            timeWasted: req.body.timeWasted

        })
            .then(function (dbAnswered) {
                res.json(dbAnswered)
            })
    })

    app.delete("/api/answered/:id", function(req, res) {
        console.log("Question ID:");
        console.log(req.params.id);
        Answered.destroy({
          where: {
            id: req.params.id
          }
        }).then(function() {
          res.end();
        });
      });

}