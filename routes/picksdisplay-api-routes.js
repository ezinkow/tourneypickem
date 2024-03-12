// Requiring our models
const { Picksdisplays } = require("../models");


module.exports = function (app) {

      // Find picks_display where set to visible
    app.get('/api/picksdisplay', function (req, res) {
        Picksdisplays.findAll({})
            .then(function (dbpicksdisplay) {
                res.json(dbpicksdisplay)
                console.log('db',dbpicksdisplay)
            })
    })

    // // Find picks_display where id = __
    // app.get('/api/picks_display/:id', function (req, res) {
    //     Picks.findAll({}
    //     )
    //         .then(function (dbpicks) {
    //             res.json(dbpicks)
    //         })
    //     console.log(req.params)
    // })



}