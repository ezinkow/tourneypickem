import React from 'react'
import Welcome from '../components/Welcome'
import HomeNavbar from '../components/HomeNavbar'
import HomeBody from '../components/HomeBody'
import TestimonialsCards from '../components/TestimonialsCards'
import TestimonialsForm from '../components/TestimonialsForm'

export default function Home() {


    return (
        <div className='body'>
            <HomeNavbar />
            <HomeBody />
            <TestimonialsForm />
            <TestimonialsCards />
        </div>
    )
}