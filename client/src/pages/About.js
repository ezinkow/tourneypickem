import React from 'react'
import AboutHeader from '../images/aboutheader.png'
import Navbar from '../components/Navbar.js'
import Dad from '../images/dad2.jpg'
import AskLogo from '../images/askthisdad.png'


export default function Ask() {

    return (
        <>
            <Navbar />
            <img src={AboutHeader} alt='Ask!' className='header' />
            <h4 className='about'><img src={Dad} alt='dad knows' align="left" className='aboutImg'></img>This dad is uniquely qualified to take your question. He first became a dad (an abba) 36 years ago and is the proud father of 4 adult children and 2 children-in-law and even they turn to this dad for guidance. He has 3 grandchildren who will soon be asking questions about how to tie their shoes (and yes, he has the right way to do that). He is a man steeped in values and places integrity above all else.  In other words, if you ask because you are considering cheating on your taxes or not telling the waiter she missed your drinks on the bill, you got the wrong guy. He has been a camp director (so thousands of parents trusted him with their children for nearly a decade), a Hillel Rabbi (and survived 3 years of other people’s college kids) and a congregational rabbi for 20 years. That means there is flat out nothing he has not heard, no complaint he cannot handle, no trauma too great and no question too deep. Yes, if you want to <span className='askthisdad'><img src={AskLogo} className='askLogoAbout'/> Ask This Dad</span> about your faith, your pending conversation with your parents about a relationship they just might not understand, an ethical dilemma, or whatever is troubling you…he's your guy. He can talk baseball (way more than you thought possible) or football. Don’t ask about basketball or golf. He understands anxiety, panic, and the lack of motivation. He has seen it all and that includes math, paper editing, public speaking advice and, as if you are not yet impressed, <span className='askthisdad'><img src={AskLogo} className='askLogoAbout'/> Ask This Dad</span> is an avid cyclist (long before it was cool), and can advise you on cycling and exercise in general. He just might be the fittest rabbi you ever met. Just one warning, <span className='askthisdad'><img src={AskLogo} className='askLogoAbout'/> Ask This Dad</span> believes that if you lost 20 pounds, your basic health issues will be cured.  <span className='askthisdad'><img src={AskLogo} className='askLogoAbout'/> Ask This Dad</span> was born in California and his own dad, of blessed memory, loved to tinker and fix stuff, and his son got that bug. He is married to Elka, who may have her own strengths, but none of them overlap. Therefore she will have little to contribute to this website. Except this.</h4>
        </>
    )
}