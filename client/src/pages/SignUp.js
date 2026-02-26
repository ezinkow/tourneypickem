import React from 'react'
import Navbar from '../components/Navbar'
import UserSubmit from '../components/UserSubmit'
import Users from '../components/UsersDisplay'


export default function SignUp() {


    return (
        <div>
            <Navbar />
            <div className='container'>
                <UserSubmit />
              </div>
              <Users />
        </div>
    )
}