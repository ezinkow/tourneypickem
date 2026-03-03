import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const NAVBAR_HEIGHT = 65; // matches your --navbar-height CSS variable

    // Close menu on navigation
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    // Lock scroll when menu open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
    }, [menuOpen]);

    const handleNavClick = (path) => {
        setMenuOpen(false);
        if (location.pathname !== path) {
            navigate(path);
        }
    };

    return (
        <>
            <header className="navbar-header">
                <div className="navbar-inner">
                    {/* Brand */}
                    <Link to="/" className="navbar-brand">
                        🏀 CHAMP WEEK PICK'EM ⛹🏾‍♂️
                    </Link>

                    {/* Hamburger Toggle (Mobile Only) */}
                    <button
                        className="menu-toggle"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? "✕" : "☰"}
                    </button>

                    {/* Desktop Nav Links */}
                    <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
                        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                        <Link to="/picks" onClick={() => setMenuOpen(false)}>Make Picks</Link>
                        <Link to="/mypicks" onClick={() => setMenuOpen(false)}>My Picks</Link>
                        <Link to="/scoreboard" onClick={() => setMenuOpen(false)}>Scoreboard</Link>
                        <Link to="/picksdisplay" onClick={() => setMenuOpen(false)}>Group Picks</Link>
                        <Link to="/standings" onClick={() => setMenuOpen(false)}>Standings</Link>
                        <Link to="/signup" onClick={() => setMenuOpen(false)}>Sign Up</Link>
                    </nav>
                </div>
            </header>

            {/* Overlay — closes menu when tapping outside */}
            {menuOpen && (
                <div
                    className="menu-overlay"
                    onClick={() => setMenuOpen(false)}
                />
            )}

            {/* Mobile Bottom Nav Bar */}
            <nav className="mobile-bottom-nav">
                <button onClick={() => handleNavClick("/")} className="mobile-nav-link">
                    🏠<span>Home</span>
                </button>
                <button onClick={() => handleNavClick("/picks")} className="mobile-nav-link">
                    📝<span>Picks</span>
                </button>
                <button onClick={() => handleNavClick("/mypicks")} className="mobile-nav-link">
                    🗒️<span>My Picks</span>
                </button>
                <button onClick={() => handleNavClick("/standings")} className="mobile-nav-link">
                    🏆<span>Standings</span>
                </button>
                <button onClick={() => handleNavClick("/scoreboard")} className="mobile-nav-link">
                    🔢<span>Scores</span>
                </button>
                <button onClick={() => handleNavClick("/picksdisplay")} className="mobile-nav-link">
                    👥<span>Group</span>
                </button>
            </nav>
        </>
    );
}