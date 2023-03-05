const { Standings } = require("../models");

module.exports = function (app) {

    // Get everything in Standings table
    app.get("/api/standings", function (req, res) {
        Standings.findAll({})
            .then(function (dbstandings) {
                res.json(dbstandings)
            })
    });
}