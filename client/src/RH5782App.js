import React from 'react'
import './App.css';
import {
  HashRouter as Router,
  Switch,
  Route,
  // Link
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Wish from './pages/Wish'
// import Wishes from './pages/Wishes'

export default function App() {

  return (
    <Router>
      <>
        <Switch>
          <Route path="/wish">
            <Wish />
          </Route>
          {/* <Route path="/wishes">
            <Wishes />
          </Route> */}
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </>
    </Router>
  )
}
