import React from 'react'
import Welcome from '../components/Welcome'
import Navbar from '../components/Navbar'
import HomeBody from '../components/HomeBody'
import TestimonialsCards from '../components/TestimonialsCards'
import TestimonialsForm from '../components/TestimonialsForm'
import AskQuestionForm from '../components/AskQuestionForm'
import QuestionCards from '../components/QuestionCards'


export default function Home() {


    return (
        <div className='body'>
            <Navbar />
            <HomeBody />
            <AskQuestionForm />
            <QuestionCards />
            <TestimonialsForm />
            <TestimonialsCards />
        </div>
    )
}