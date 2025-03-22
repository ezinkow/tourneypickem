import React from 'react'
import './App.css';
import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import PicksToday from './pages/PicksToday';
import PicksTomorrow from './pages/PicksTomorrow';
import PicksDisplay from './pages/PicksDisplay';
import Standings from './pages/Standings';
import GameResults from './pages/GameResults';
import SignUp from './pages/SignUp';

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/pickstoday" element={<PicksToday />} />
        <Route path="/pickstomorrow" element={<PicksTomorrow />} />
        <Route path="/picksdisplay" element={<PicksDisplay />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/gameresults" element={<GameResults />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}
