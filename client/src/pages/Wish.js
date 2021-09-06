import React from 'react'
import AskQuestionForm from '../components/WishForm'
import Navbar from '../components/Navbar.js'

export default function Ask() {

    return (
        <>
            <Navbar />
            <div className='container'>
                <div className='row'>
                    <div className='col-4'>
                        {/* <img src={dad3} alt='dad3' className='askImg'/> */}
                    </div>
                    <div className='col-4'>
                        <AskQuestionForm />
                    </div>
                    <div className='col-4'>
                        {/* <img src={dad6} alt='dad6' className='askImg'/> */}
                    </div>
                </div>
            </div>
        </>
    )
}