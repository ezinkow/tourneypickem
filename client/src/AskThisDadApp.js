import React from 'react'
import './App.css';
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
          <Route path="/askthisdad.herokuapp.com/ask">
            <Ask />
          </Route>
          <Route path="/answered">
            <Answered />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </>
    </Router>
  )
}
