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
import OnDeckGames from './pages/OnDeckGames';
import InTheHoleGames from './pages/InTheHoleGames';
import PicksDisplay from './pages/PicksDisplay';
import Standings from './pages/Standings';

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/todayspicks" element={<TodaysPicks />} />
        <Route path="/tomorrowsgames" element={<OnDeckGames />} />
        <Route path="/twodaysout" element={<InTheHoleGames />} />
        <Route path="/picksdisplay" element={<PicksDisplay />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}
