import React from 'react'
import Navbar from '../components/Navbar'
import MyPicks from '../components/MyPicks'

export default function Games() {


    return (
        <div>
            <Navbar />
            <div className='=container'>
                <MyPicks />
            </div>
        </div>
    )
}