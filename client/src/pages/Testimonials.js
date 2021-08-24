import React from 'react'
import Navbar from '../components/Navbar'
import TestimonialsCards from '../components/TestimonialsCards'
import TestimonialsCarousel from '../components/TestimonialsCarousel'
import TestimonialsForm from '../components/TestimonialsForm'
import TestimonialsHeader from '../images/testimonialsheader.png'
import dad4 from '../images/dad4.jpg'
import dad5 from '../images/dad5.jpg'

export default function () {

    return (
        <>
            <Navbar />
            <img src={TestimonialsHeader} alt='testimonials' className="header" />
            <div className='container'>
                <div className='row'>
                    <div className='col-4'>
                        <img src={dad4} alt='dad4' className='askImg' />
                    </div>
                    <div className='col-5'>
                        <TestimonialsCarousel />
                    </div>
                    <div className='col-3'>
                        <img src={dad5} alt='dad5' className='askImg' />
                    </div>
                </div>
            </div>
            <TestimonialsCards />
            <TestimonialsForm />
        </>
    )
}