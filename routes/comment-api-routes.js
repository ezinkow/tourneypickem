// Requiring our models
const { Comment } = require("../models");


module.exports = function (app) {

    // Get everything in Comments table
    app.get("/api/comments", function (req, res) {
        Comment.findAll({})
            .then(function (dbStatement) {
                res.json(dbStatement)
            })
    });

    // Post new comment to comment table
    app.post("/api/comment", function (req, res) {
        Comment.create({
            name: req.body.name,
            comment: req.body.comment,
            hashtag: req.body.hashtag
        })
            .then(function (dbStatement) {
                res.json(dbStatement)
            })
    });

    // Find comment where id = __
    app.get('/api/comment/:id', function (req, res) {
        Comment.findAll({
            where: {
                id: req.params.id
            }
        })
            .then(function (dbStatement) {
                res.json(dbStatement)
            })
    });

    // Delete comment
    app.delete("/api/comment/:id", function(req, res) {
        Comment.destroy({
          where: {
            id: req.params.id
          }
        }).then(function() {
          res.end();
        });
      });

}