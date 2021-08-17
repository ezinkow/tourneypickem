import React from 'react'
import './App.css';
import './CssReset.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Ask from './pages/Ask'
import Answered from './pages/Answered'

export default function App() {

  return (
    <Router>
      <>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/ask">
            <Ask />
          </Route>
          <Route path="/answered">
            <Answered />
          </Route>
        </Switch>
      </>
    </Router>
  )
}
