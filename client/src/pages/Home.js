import React from 'react'
import Navbar from '../components/Navbar'
import HomeBody from '../components/HomeBody'
import WishApples from '../components/WishApples'


export default function Home() {


    return (
        <div className='body'>
            <Navbar />
            <HomeBody />
            <WishApples />
        </div>
    )
}