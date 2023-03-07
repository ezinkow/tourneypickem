import React from 'react'
import './App.css';
import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import TodaysPicksAm from './pages/TodaysPicksAm';
import TodaysPicksPm from './pages/TodaysPicksPm';
import OnDeckGames from './pages/OnDeckGames';
import InTheHoleGames from './pages/InTheHoleGames';
import PicksDisplay from './pages/PicksDisplay';
import PicksDisplay36 from './pages/PicksDisplay36';
import Standings from './pages/Standings';

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/todayspicksam" element={<TodaysPicksAm />} />
        <Route path="/todayspickspm" element={<TodaysPicksPm />} />
        <Route path="/tomorrowsgames" element={<OnDeckGames />} />
        <Route path="/twodaysout" element={<InTheHoleGames />} />
        <Route path="/picksdisplay" element={<PicksDisplay />} />
        <Route path="/picksdisplay36" element={<PicksDisplay36 />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}
