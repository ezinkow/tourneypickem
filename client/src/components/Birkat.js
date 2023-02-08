import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Document, Page } from 'react-pdf';
import Birkat1 from '../images/birkat-1.jpg'
import Birkat2 from '../images/birkat-2.jpg'
import Birkat3 from '../images/birkat-3.jpg'
import Birkat4 from '../images/birkat-4.jpg'
//pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


export default function BirkatHamazon() {


    return (
        <div className='container birkatContainer'>
            <img className="birkat" src={Birkat1} alt='birkat-1' />
            <img className="birkat" src={Birkat2} alt='birkat-2' />
            <img className="birkat" src={Birkat3} alt='birkat-3' />
            <img className="birkat" src={Birkat4} alt='birkat-4' />
        </div>
    )





}