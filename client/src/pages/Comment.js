import React from 'react'
import CommentForm from '../components/CommentForm'
import Navbar from '../components/Navbar.js'

export default function Comment() {

    return (
        <>
            <Navbar />
            <div className='container commentForm'>
                <div className='row'>
                    <div className='col-1'>
                    </div>
                    <div className='col-10'>
                        <CommentForm />
                    </div>
                    <div className='col-1'>
                    </div>
                </div>
            </div>
        </>
    )
}