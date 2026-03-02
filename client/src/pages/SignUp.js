import React from 'react'
import Navbar from '../components/Navbar'
import SignUp from '../components/SignUp'
import Users from '../components/UsersDisplay'


export default function UserSignUp() {


    return (
        <div>
            <Navbar />
            <div className='container page-content'>
                <SignUp />
              </div>
              <Users />
        </div>
    )
}