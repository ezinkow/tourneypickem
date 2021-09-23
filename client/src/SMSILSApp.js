import React from 'react'
import './App.css';
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Statement from './pages/Statement'

export default function App() {

  return (
      <Router>
        <Switch>
          <Route path="/statement">
            <Statement />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
  )
}
