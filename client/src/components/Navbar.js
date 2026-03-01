import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="navbar">
      <div className="navbar-inner">

        <button className="menu-toggle" onClick={() => setOpen(!open)}>
          ☰
        </button>

        <Link to="/" className="navbar-brand">
          🏀 Champ Week Pick'em
        </Link>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          <Link to="/">Home</Link>
          <Link to="/picks">Make Picks</Link>
          <Link to="/mypicks">My Picks</Link>
          <Link to="/scoreboard">Scoreboard</Link>
          <Link to="/standings">Standings</Link>
          <Link to="/signup">Sign Up</Link>
        </nav>
      </div>
    </header>
  );
}