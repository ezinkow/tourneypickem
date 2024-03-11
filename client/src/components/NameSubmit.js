import React from 'react'
import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'


export default function NameSubmit() {
    const [name, setName] = useState('')
    const [modalIsOpen, setIsOpen] = useState('')

    const handleNameChange = event => {
        setName(event.target.value)
        console.log(name)
    }

    const handleNameSubmit = event => {
        event.preventDefault()
        setIsOpen(true);
        axios.post('api/names', {
            name
        })
        toast.success(`Thanks, ${name}, name submitted.`,
            {
                duration: 10001,
                position: 'top-center',
                style: {
                    border: '2px solid #713200',
                    padding: '20px',
                    marginTop: '100px',
                    color: 'white',
                    backgroundColor: 'rgb(60, 179, 113, 0.7)'
                },
                icon: '🏀',
                role: 'status',
                ariaLive: 'polite',
            });
        setName("")
    }

    return (
        < div >
            < form >
                <Toaster />
                <label for="fname"><h3>Enter your name. This will be the name you select all tournament:</h3></label><br />
                <input onChange={handleNameChange} type="text" id="name" value={name} placeholder='Name' /><br /><br />
                <Button onClick={handleNameSubmit} type="submit" value="Submit">Submit</Button>
                <h3>Please check the list below for any name duplicates, include last initial if needed</h3>
            </form >
        </div >
    )
}