import React from 'react'
import SignUp from '../../components/pickem/SignUp'
import Users from '../../components/pickem/UsersDisplay'


export default function UserSignUp() {


    return (
        <div>
            <div className='container page-content'>
                <SignUp />
              </div>
              <Users />
        </div>
    )
}