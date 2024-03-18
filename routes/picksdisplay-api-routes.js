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

}