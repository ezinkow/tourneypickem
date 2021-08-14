import React from 'react'
import './App.css';
import Header from './components/Header'
import Body from './components/Body'
import 'bootstrap/dist/css/bootstrap.min.css';
import Answered from './components/Answered';

export default function App() {

  return (
    <>
      <Header />
      <Body />
      <Answered />
    </>
  )
}
