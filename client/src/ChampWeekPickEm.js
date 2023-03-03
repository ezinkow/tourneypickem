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
import TestPage from './pages/TestPage';

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/todayspicks" element={<TodaysPicks />} />
        <Route path="/testpage" element={<TestPage />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}
