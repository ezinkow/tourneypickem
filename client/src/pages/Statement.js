import React from 'react'
import AskQuestionForm from '../components/StatementForm'
import Navbar from '../components/Navbar.js'
import Header from '../components/Header.js'

export default function Ask() {

    return (
        <>
            <Navbar />
            <Header />
            <div className='container'>
                <div className='row'>
                    <div className='col-4'>
                    </div>
                    <div className='col-4'>
                        <AskQuestionForm />
                    </div>
                    <div className='col-4'>
                    </div>
                </div>
            </div>
        </>
    )
}