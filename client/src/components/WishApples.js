import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import apple from '../images/apple.png'

export default function Testimonials() {
    const [wishes, setWishes] = useState([])

    useEffect(() => {
        async function fetchWishes() {
            try {
                const response = await axios('api/wish')
                console.log(response)
                setWishes(response.data)
            } catch (e) {
                console.log(e)
            }
        }
        fetchWishes()
    }, [])

    useEffect(() => {
        console.log(wishes)
    })

    return (
        <div className='row apples'>
            {wishes.length > 0 ? wishes.map(wish =>
                <div className='col-3 appleContainer'>
                    <img src={apple} alt="apple" className="appleImg" />
                    <div className='wishText'>
                        <h4>"{wish.wish}"</h4>
                        <p className='wishName'>-{wish.name}</p>
                    </div>
                </div>
            ) : ""}
        </div>
    )
}