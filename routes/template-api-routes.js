// Requiring our models
const { Post } = require("../models");


module.exports = function (app) {

    // Get everything in Posts table
    app.get("/api/posts", function (req, res) {
        Post.findAll({})
            .then(function (dbStatement) {
                res.json(dbStatement)
            })
    })

    // Post new post to post table
    app.post("/api/post", function (req, res) {
        Post.create({
            name: req.body.name,
            post: req.body.post
        })
            .then(function (dbStatement) {
                res.json(dbStatement)
            })
    })

    // Find post where id = __
    app.get('/api/post/:id', function (req, res) {
        Post.findAll({
            where: {
                id: req.params.id
            }
        })
            .then(function (dbStatement) {
                res.json(dbStatement)
            })
    })

    // Delete post
    app.delete("/api/post/:id", function(req, res) {
        Post.destroy({
          where: {
            id: req.params.id
          }
        }).then(function() {
          res.end();
        });
      });

}