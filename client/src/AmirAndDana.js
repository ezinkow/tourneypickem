import React from 'react'
import './App.css';
import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Comment from './pages/Comment'
import Comments from './pages/Comments'
import Birkat from './pages/Birkat'

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/comment" element={<Comment />} />
        <Route path="/comments" element={<Comments />} />
        <Route path="/birkat" element={<Birkat />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}
