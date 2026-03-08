import React from 'react'
import './App.css';
import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
// import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Picks from './pages/Picks';
import MyPicks from './pages/MyPicks';
import UserPicksDisplay from './pages/UserPicksDisplay';
import Standings from './pages/Standings';
import SignUp from './pages/SignUp';
import Scoreboard from './pages/Scoreboard';
import AdminRefresh from './pages/AdminRefresh';
import ChangePassword from './pages/ChangePassword';

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/picks" element={<Picks />} />
        <Route path="/mypicks" element={<MyPicks />} />
        <Route path="/scoreboard" element={<Scoreboard />} />
        <Route path="/picksdisplay" element={<UserPicksDisplay />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/adminrefresh" element={<AdminRefresh />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}
