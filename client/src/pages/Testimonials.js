import React from 'react'
import Navbar from '../components/Navbar'
import TestimonialsCards from '../components/TestimonialsCards'
import TestimonialsCarousel from '../components/TestimonialsCarousel'
import TestimonialsForm from '../components/TestimonialsForm'
import TestimonialsHeader from '../images/testimonialsHeader.png'

export default function () {

    return (
        <>
            <Navbar />
            <img src={TestimonialsHeader} alt='testimonials' className="container header"/>
            <TestimonialsCarousel />
            <TestimonialsCards />
            <TestimonialsForm />
        </>
    )
}