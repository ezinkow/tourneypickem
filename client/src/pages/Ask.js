import React from 'react'
import AskQuestionForm from '../components/AskQuestionForm'
import AskHeader from '../images/askheader.png'
import Navbar from '../components/Navbar.js'


export default function Ask() {

    return (
        <>
            <Navbar />
            <img src={AskHeader} alt='Ask!' className='header' />
            <AskQuestionForm />
        </>
    )
}