import React from 'react'
import Navbar from '../components/Navbar'
import UserPicksDisplay from '../components/UserPicksDisplay'

export default function PicksDisplay() {


    return (
        <div className='page-content'>
            <Navbar />
            <UserPicksDisplay />
        </div>
    )
}