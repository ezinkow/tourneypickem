import React from 'react'
import Navbar from '../components/Navbar'
import TestimonialsCards from '../components/TestimonialsCards'
import TestimonialsCarousel from '../components/TestimonialsCarousel'
import TestimonialsForm from '../components/TestimonialsForm'
import TestHeader from '../images/testimonialsheader.png'

export default function () {

    return (
        <>
            <Navbar />
            <img src={TestHeader} alt='testimonials' className="container header"/>
            <TestimonialsCarousel />
            <TestimonialsCards />
            <TestimonialsForm />
        </>
    )
}