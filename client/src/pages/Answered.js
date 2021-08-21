import React from 'react'
import Navbar from '../components/Navbar'
import AnsweredCards from '../components/AnsweredCards'
import AnsweredHeader from '../images/answeredheader.png'

export default function Answered() {


    return (
        <>
            <Navbar />
            <img src={AnsweredHeader} alt='answered' className="header" />
            <AnsweredCards />
        </>
    )
}