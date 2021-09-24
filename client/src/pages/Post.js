import React from 'react'
import PostForm from '../components/PostForm'
import Navbar from '../components/Navbar.js'

export default function Ask() {

    return (
        <>
            <Navbar />
            <div className='container'>
                <div className='row'>
                    <div className='col-4'>
                    </div>
                    <div className='col-4'>
                        <PostForm />
                    </div>
                    <div className='col-4'>
                    </div>
                </div>
            </div>
        </>
    )
}