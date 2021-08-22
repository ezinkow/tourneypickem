// Requiring our models
const {Testimonial} = require("../models");


module.exports = function (app) {

    app.get("/api/testimonials", function (req, res) {
        Testimonial.findAll({})
            .then(function (dbTestimonial) {
                res.json(dbTestimonial)
            })
    })

    app.post("/api/testimonials", function (req, res) {
        Testimonial.create({
            name: req.body.name,
            testimonial: req.body.testimonial
        })
            .then(function (dbTestimonial) {
                res.json(dbTestimonial)
            })
    })

    

}