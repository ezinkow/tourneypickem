import React from 'react'
import Testimonials from '../components/Testimonials'
import TestimonialsCarousel from '../components/TestimonialsCarousel'
import TestimonialsForm from '../components/TestimonialsForm'

export default function () {

    return (
        <>
            <TestimonialsCarousel/>
            <Testimonials />
            <TestimonialsForm />
        </>
    )
}