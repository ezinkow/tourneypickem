// Requiring our models
const { Picks, Games } = require("../models");


module.exports = function (app) {

      // Find picks_display where set to visible
    app.get('/api/games/finishedAndInProgress', function (req, res) {
        Games.findAll({
            where: {
                status: ['STATUS_FINAL', 'STATUS_IN_PROGRESS', 'STATUS_HALFTIME']
            }
        })
            .then(function (dbgames) {
                res.json(dbgames)
            })
    })


}