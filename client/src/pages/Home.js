import React from 'react'
import Navbar from '../components/Navbar'
import HomeBody from '../components/HomeBody'
import QuestionCards from '../components/QuestionCards'


export default function Home() {


    return (
        <div className='body'>
            <Navbar />
            <HomeBody />
            <QuestionCards />
        </div>
    )
}