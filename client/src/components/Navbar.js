import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const isPickem = location.pathname.startsWith("/pickem");
    const isBracket = location.pathname.startsWith("/bracket");
    const isSquares = location.pathname.startsWith("/squares");
    const isHome = location.pathname === "/";
    const GOLD = "#c89d3c";

    useEffect(() => { setMenuOpen(false); }, [location.pathname]);
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
    }, [menuOpen]);

    const handleNavClick = (path) => {
        setMenuOpen(false);
        if (location.pathname !== path) navigate(path);
    };

    const pickemLinks = [
        { to: "/pickem", label: "Home", emoji: "🏠" },
        { to: "/pickem/picks", label: "Make Picks", emoji: "📝" },
        { to: "/pickem/mypicks", label: "My Picks", emoji: "🗒️" },
        { to: "/pickem/scoreboard", label: "Score board", emoji: "🔢" },
        { to: "/pickem/picksdisplay", label: "Group Picks", emoji: "👥" },
        { to: "/pickem/standings", label: "Standings", emoji: "🏆" },
        { to: "/pickem/signup", label: "Sign Up", emoji: "📋" },
    ];

    const bracketLinks = [
        { to: "/bracket", label: "Home", emoji: "🏠" },
        { to: "/bracket/bracket", label: "Bracket", emoji: "🗂️" },
        { to: "/bracket/mybracket", label: "My Bracket", emoji: "📝" },
        { to: "/bracket/standings", label: "Standings", emoji: "🏆" },
        { to: "/bracket/signup", label: "Sign Up", emoji: "📋" },
    ];

    const squaresLinks = [
        { to: "/squares", label: "Home", emoji: "🏠" },
        { to: "/squares/grid", label: "Grid", emoji: "🟩" },
        { to: "/squares/numbers", label: "Numbers", emoji: "🔢" },
        { to: "/squares/results", label: "Results", emoji: "💰" },
        { to: "/squares/signup", label: "Sign Up", emoji: "📋" },
    ];

    const activeLinks = isPickem ? pickemLinks
        : isBracket ? bracketLinks
            : isSquares ? squaresLinks
                : [];

    const brandLabel = isPickem ? "🏀PICK 'EM"
        : isBracket ? "🗂️BRACKET"
            : isSquares ? "🟩SQUARES"
                : "🏆TOURNEY";

    const navBg = isBracket ? "#030831"
        : isSquares ? "#0369a1"
            : "#13447a";

    return (
        <>
            <header className="navbar-header" style={{ backgroundColor: navBg }}>
                <div className="navbar-inner">

                    {/* Main Home link — hidden on home page */}
                    {!isHome && (
                        <div className="nav-links" style={{ marginRight: 8 }}>
                            <Link to="/" style={{ color: "white", fontSize: 12, whiteSpace: "nowrap" }}>
                                ← Home
                            </Link>
                        </div>
                    )}

                    {/* Brand */}
                    <Link to="/" className="navbar-brand">{brandLabel}</Link>

                    {/* Game switcher pills */}
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <Link
                            to="/pickem"
                            style={{
                                fontSize: 11, fontWeight: 700, padding: "4px 8px",
                                borderRadius: 12, textDecoration: "none",
                                backgroundColor: isPickem ? GOLD : "rgba(255,255,255,0.15)",
                                color: isPickem ? "#13447a" : "white",
                                whiteSpace: "nowrap",
                            }}
                        >
                            Pick'em
                        </Link>
                        <Link
                            to="/bracket"
                            style={{
                                fontSize: 11, fontWeight: 700, padding: "4px 8px",
                                borderRadius: 12, textDecoration: "none",
                                backgroundColor: isBracket ? GOLD : "rgba(255,255,255,0.15)",
                                color: isBracket ? "#030831" : "white",
                                whiteSpace: "nowrap",
                            }}
                        >
                            Bracket
                        </Link>
                        <Link
                            to="/squares"
                            style={{
                                fontSize: 11, fontWeight: 700, padding: "4px 8px",
                                borderRadius: 12, textDecoration: "none",
                                backgroundColor: isSquares ? GOLD : "rgba(255,255,255,0.15)",
                                color: isSquares ? "#0369a1" : "white",
                                whiteSpace: "nowrap",
                            }}
                        >
                            Squares
                        </Link>
                    </div>

                    {/* Hamburger */}
                    <button
                        className="menu-toggle"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? "✕" : "☰"}
                    </button>

                    {/* Desktop nav links */}
                    <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
                        {activeLinks.map(({ to, label }) => (
                            <Link key={to} to={to} onClick={() => setMenuOpen(false)}>{label}</Link>
                        ))}
                    </nav>

                </div>
            </header>

            {menuOpen && (
                <div className="menu-overlay" onClick={() => setMenuOpen(false)} />
            )}

            {/* Mobile bottom nav */}
            <nav className="mobile-bottom-nav" style={{ backgroundColor: navBg }}>
                {activeLinks
                    .filter(({ to }) => to !== "/pickem/signup")
                    .filter(({ to }) => to !== "/bracket/signup")
                    .map(({ to, label, emoji }) => (
                        <button
                            key={to}
                            onClick={() => handleNavClick(to)}
                            className="mobile-nav-link"
                        >
                            {emoji}<span>{label}</span>
                        </button>
                    ))}
            </nav>
        </>
    );
}