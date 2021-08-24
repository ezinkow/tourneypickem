import React from 'react'
import AskQuestionForm from '../components/AskQuestionForm'
import AskHeader from '../images/askheader.png'
import dad3 from '../images/dad3.jpg'
import dad6 from '../images/dad6.jpg'
import Navbar from '../components/Navbar.js'



export default function Ask() {

    return (
        <>
            <Navbar />
            <img src={AskHeader} alt='Ask!' className='header' />
            <div className='container'>
                <div className='row'>
                    <div className='col-4'>
                        <img src={dad3} alt='dad3' className='askImg'/>
                    </div>
                    <div className='col-4'>
                        <AskQuestionForm />
                    </div>
                    <div className='col-4'>
                        <img src={dad6} alt='dad6' className='askImg'/>
                    </div>
                </div>
            </div>
        </>
    )
}