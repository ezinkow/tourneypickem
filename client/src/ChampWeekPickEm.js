import React from 'react'
import './App.css';
import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import TodaysPicks from './pages/TodaysPicks';
import TomorrowGames from './pages/TomorrowGames';
import TwoDaysOut from './pages/TwoDaysOut';

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/todayspicks" element={<TodaysPicks />} />
        <Route path="/tomorrowsgames" element={<TomorrowGames />} />
        <Route path="/twodaysout" element={<TwoDaysOut />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}
