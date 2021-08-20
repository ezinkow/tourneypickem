import React from 'react'
import Welcome from '../components/Welcome'
import HomeNavbar from '../components/HomeNavbar'
import HomeBody from '../components/HomeBody'
import Testimonials from './Testimonials'

export default function Home() {


    return (
        <div className='body'>
            <HomeNavbar />
            <HomeBody />
            <Testimonials />
        </div>
    )
}