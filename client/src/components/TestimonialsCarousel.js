import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Carousel from 'react-bootstrap/Carousel'

export default function TestimonialsCarousel() {
    const [testimonials, setTestimonials] = useState({})

    useEffect(() => {
        async function fetchTestimonials() {
            try {
                const response = await axios('api/testimonials')
                setTestimonials(response.data)
            } catch (e) {
                console.log(e)
            }
        }
        fetchTestimonials()
    }, [])

    useEffect(() => {
        console.log(testimonials)
    })

    const test1 = testimonials.length > 0 ? testimonials[0].testimonial : ""
    const name1 = testimonials.length > 0 ? testimonials[0].name : ""
    const test2 = testimonials.length > 0 ? testimonials[1].testimonial : ""
    const name2 = testimonials.length > 0 ? testimonials[1].name : ""
    const test3 = testimonials.length > 0 ? testimonials[2].testimonial : ""
    const name3 = testimonials.length > 0 ? testimonials[2].name : ""
    console.log(test1)

    return (
        <Carousel className="carousel">
            <Carousel.Item className="carouselItem">
                <h1>"{test1}"</h1>
                <h3 className="carouselSub">-{name1}</h3>
            </Carousel.Item>
            <Carousel.Item className="carouselItem">
                <h1>"{test2}"</h1>
                <h3 className="carouselSub">-{name2}</h3>
            </Carousel.Item>
            <Carousel.Item className="carouselItem">
                <h1>"{test3}"</h1>
                <h3 className="carouselSub">-{name3}</h3>
            </Carousel.Item>
        </Carousel>
    )
}