import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="navbar-header">
            <div className="navbar-inner">
                {/* Brand / Logo Section */}
                <Link to="/" className="navbar-brand">
                    🏀 CHAMP WEEK PICK'EM ⛹🏾‍♂️
                </Link>

                {/* Hamburger Toggle (Mobile Only) */}
                <button className="menu-toggle" onClick={() => setOpen(!open)}>
                    {open ? "✕" : "☰"}
                </button>

                {/* Navigation Links */}
                <nav className={`nav-links ${open ? "open" : ""}`}>
                    <Link to="/" onClick={() => setOpen(false)}>Home</Link>
                    <Link to="/picks" onClick={() => setOpen(false)}>Make Picks</Link>
                    <Link to="/mypicks" onClick={() => setOpen(false)}>My Picks</Link>
                    <Link to="/scoreboard" onClick={() => setOpen(false)}>Scoreboard</Link>
                    <Link to="/picksdisplay" onClick={() => setOpen(false)}>Group Picks</Link>
                    <Link to="/standings" onClick={() => setOpen(false)}>Standings</Link>
                    <Link to="/signup" onClick={() => setOpen(false)}>Sign Up</Link>
                </nav>
            </div>
        </header>
    );
}