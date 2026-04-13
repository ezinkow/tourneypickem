import React from 'react';
import './App.css';
import { HashRouter as Router, Routes, Route } from "react-router-dom";

// Shared
import Home from './pages/Home';
import SignUp from './pages/SignUp';         // ← shared account creation
import Navbar from './components/Navbar';

// Pickem pages
import PickemHome from './pages/pickem/Home';
import Picks from './pages/pickem/Picks';
import MyPicks from './pages/pickem/MyPicks';
import PickemStandings from './pages/pickem/Standings';
import PickemScoreboard from './pages/pickem/Scoreboard';
import UserPicksDisplay from './pages/pickem/UserPicksDisplay';
import PickemSignUp from './pages/pickem/SignUp';
import PickemAdminRefresh from './pages/pickem/AdminRefresh';
import PickemChangePassword from './pages/pickem/ChangePassword';

// Squares pages
import SquaresGrid from "./pages/squares/SquaresGrid";
import SquaresResults from "./pages/squares/SquaresResults";
import SquaresSignUp from "./pages/squares/SquaresSignUp";
import SquaresNumbers from "./pages/squares/SquaresNumbers";
import SquaresChangePassword from "./pages/squares/SquaresChangePassword";
import SquaresHome from "./pages/squares/Home";
import SquaresAdmin from "./pages/squares/SquaresAdmin";

// Bracket pages
import BracketHome from './pages/bracket/Home';
import BracketChallenge from './pages/bracket/Bracket';
import MyBracket from './pages/bracket/MyBracket';
import BracketStandings from './pages/bracket/Standings';
import BracketSignUp from './pages/bracket/SignUp';
import BracketChangePassword from './pages/bracket/ChangePassword';

// NBA pages
import NbaHome from './pages/nba/Home';
import NbaPicks from './pages/nba/Picks';
import NbaMyPicks from './pages/nba/MyPicks';
import NbaStandings from './pages/nba/Standings';
import NbaGroupPicks from './pages/nba/GroupPicks';
import NbaSignUp from './pages/nba/SignUp';       // ← pool entry, not account creation
import NbaChangePassword from './pages/nba/ChangePassword';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Landing + shared account creation */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Pickem */}
        <Route path="/pickem" element={<PickemHome />} />
        <Route path="/pickem/picks" element={<Picks />} />
        <Route path="/pickem/mypicks" element={<MyPicks />} />
        <Route path="/pickem/standings" element={<PickemStandings />} />
        <Route path="/pickem/scoreboard" element={<PickemScoreboard />} />
        <Route path="/pickem/picksdisplay" element={<UserPicksDisplay />} />
        <Route path="/pickem/signup" element={<PickemSignUp />} />
        <Route path="/pickem/adminrefresh" element={<PickemAdminRefresh />} />
        <Route path="/pickem/change-password" element={<PickemChangePassword />} />

        {/* Bracket */}
        <Route path="/bracket" element={<BracketHome />} />
        <Route path="/bracket/bracket" element={<BracketChallenge />} />
        <Route path="/bracket/mybracket" element={<MyBracket />} />
        <Route path="/bracket/standings" element={<BracketStandings />} />
        <Route path="/bracket/signup" element={<BracketSignUp />} />
        <Route path="/bracket/change-password" element={<BracketChangePassword />} />

        {/* Squares */}
        <Route path="/squares" element={<SquaresHome />} />
        <Route path="/squares/grid" element={<SquaresGrid />} />
        <Route path="/squares/results" element={<SquaresResults />} />
        <Route path="/squares/signup" element={<SquaresSignUp />} />
        <Route path="/squares/numbers" element={<SquaresNumbers />} />
        <Route path="/squares/change-password" element={<SquaresChangePassword />} />
        <Route path="/squares/admin" element={<SquaresAdmin />} />

        {/* NBA */}
        <Route path="/nba" element={<NbaHome />} />
        <Route path="/nba/picks" element={<NbaPicks />} />
        <Route path="/nba/mypicks" element={<NbaMyPicks />} />
        <Route path="/nba/standings" element={<NbaStandings />} />
        <Route path="/nba/grouppicks" element={<NbaGroupPicks />} />
        <Route path="/nba/signup" element={<NbaSignUp />} />
        <Route path="/nba/change-password" element={<NbaChangePassword />} />
      </Routes>
    </Router>
  );
}