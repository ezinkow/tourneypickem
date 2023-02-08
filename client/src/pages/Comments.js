import React from 'react'
import CommentCards from '../components/CommentCards'
import Navbar from '../components/Navbar.js'

export default function Comments() {

    return (
        <>
            <Navbar />
            <div className='commentCards'>
                <CommentCards />
            </div>
        </>
    )
}