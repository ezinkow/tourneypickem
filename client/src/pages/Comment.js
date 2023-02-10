import React from 'react'
import CommentForm from '../components/CommentForm'
import Navbar from '../components/Navbar.js'

export default function Comment() {

    return (
        <>
            <Navbar />
            <div className='container commentForm'>
                <div className='row'>
                    <div className='col-3'>
                    </div>
                    <div className='col-6'>
                        <CommentForm />
                    </div>
                    <div className='col-3'>
                    </div>
                </div>
            </div>
        </>
    )
}