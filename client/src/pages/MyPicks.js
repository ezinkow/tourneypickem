import React from 'react'
import Navbar from '../components/Navbar'
import MyPicks from '../components/MyPicks'

export default function Games() {


    return (
        <>
            <Navbar />
            <div>
                <div className='page-content'>
                    <MyPicks />
                </div>
            </div>
        </>
    )
}