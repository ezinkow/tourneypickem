import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const GOLD = "#c89d3c";

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, login, logout, loading } = useAuth();

    const [menuOpen, setMenuOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [loginName, setLoginName] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [loginSubmitting, setLoginSubmitting] = useState(false);

    const isPickem = location.pathname.startsWith("/pickem");
    const isBracket = location.pathname.startsWith("/bracket");
    const isSquares = location.pathname.startsWith("/squares");
    const isNba = location.pathname.startsWith("/nba");
    const isHome = location.pathname === "/";

    const SIGNUP_LOCK = new Date("2026-03-19T16:15:00Z");
    const signupLocked = new Date() >= SIGNUP_LOCK;

    useEffect(() => { setMenuOpen(false); }, [location.pathname]);
    useEffect(() => {
        document.body.style.overflow = (menuOpen || showLogin) ? "hidden" : "";
    }, [menuOpen, showLogin]);

    const handleNavClick = (path) => {
        setMenuOpen(false);
        if (location.pathname !== path) navigate(path);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError("");
        setLoginSubmitting(true);
        const result = await login(loginName.trim(), loginPassword);
        setLoginSubmitting(false);
        if (result.success) {
            setShowLogin(false);
            setLoginName("");
            setLoginPassword("");
        } else {
            setLoginError(result.error);
        }
    };

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
    };

    // ── Nav link definitions ──────────────────────────────────────────────────

    const nbaLinks = [
        { to: "/nba", label: "Home", emoji: "🏠" },
        { to: "/nba/picks", label: "Picks", emoji: "📝" },
        { to: "/nba/mypicks", label: "My Picks", emoji: "📋" },
        { to: "/nba/standings", label: "Standings", emoji: "🏆" },
        { to: "/nba/grouppicks", label: "Group Picks", emoji: "👥" },
        { to: "/nba/signup", label: "Join Pool", emoji: "▶️" },
    ];

    // Links shown specifically when on the main site homepage
    const homeLinks = [
        { to: "/nba", label: "NBA Playoffs Pool", emoji: "🏆" }
    ];

    const activeLinks = (
        isNba ? nbaLinks : 
        isHome ? homeLinks : 
        []
    ).filter(({ to }) => !signupLocked || !to.endsWith("/signup"));

    const brandLabel = isNba ? "🏀 NBA PLAYOFFS" : "🏆 POOL PLAY 🏊";

    const navBg = isNba ? "#0a1628" : "#13447a";

    const pill = (active, activeText) => ({
        fontSize: 11, fontWeight: 700, padding: "4px 8px",
        borderRadius: 12, textDecoration: "none",
        backgroundColor: active ? GOLD : "rgba(255,255,255,0.15)",
        color: active ? activeText : "white",
        whiteSpace: "nowrap",
    });

    return (
        <>
            <header className="navbar-header" style={{ backgroundColor: navBg }}>
                <div className="navbar-inner">
                    {!isHome && (
                        <div className="nav-links" style={{ marginRight: 8 }}>
                            <Link to="/" style={{ color: "white", fontSize: 12, whiteSpace: "nowrap" }}>
                                ← Home
                            </Link>
                        </div>
                    )}

                    <Link to="/" className="navbar-brand" style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
                        {brandLabel}
                    </Link>

                    <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                        <Link to="/nba" style={pill(isNba, "#0a1628")}>NBA</Link>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
                        {!loading && (
                            user ? (
                                <>
                                    <span style={{ color: GOLD, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
                                        {user.name}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            fontSize: 11, fontWeight: 700, padding: "4px 10px",
                                            borderRadius: 12, border: "1px solid rgba(255,255,255,0.3)",
                                            background: "transparent", color: "white", cursor: "pointer",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        Log out
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setShowLogin(true)}
                                    style={{
                                        fontSize: 11, fontWeight: 700, padding: "4px 10px",
                                        borderRadius: 12, border: "none",
                                        background: GOLD, color: "#0a1628", cursor: "pointer",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    Log in
                                </button>
                            )
                        )}
                    </div>

                    <button
                        className="menu-toggle"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? "✕" : "☰"}
                    </button>

                    <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
                        {isHome && <div style={{ padding: "10px 20px", fontSize: "10px", color: GOLD, fontWeight: 800, letterSpacing: "1px" }}>ACTIVE GAMES</div>}
                        {activeLinks.map(({ to, label, emoji }) => (
                            <Link key={to} to={to} onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <span style={{ fontSize: "16px" }}>{emoji}</span>
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>

            {menuOpen && (
                <div className="menu-overlay" onClick={() => setMenuOpen(false)} />
            )}

            <nav className="mobile-bottom-nav" style={{ backgroundColor: navBg }}>
                {activeLinks
                    .filter(({ to }) => !to.endsWith("/signup"))
                    .map(({ to, label, emoji }) => (
                        <button key={to} onClick={() => handleNavClick(to)} className="mobile-nav-link">
                            {emoji}<span>{label}</span>
                        </button>
                    ))}
            </nav>

            {/* Login Modal */}
            {showLogin && (
                <div
                    onClick={() => setShowLogin(false)}
                    style={{
                        position: "fixed", inset: 0, zIndex: 9000,
                        background: "rgba(0,0,0,0.55)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        padding: 16,
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            position: "relative",
                            background: "white", borderRadius: 16, padding: 32,
                            width: "100%", maxWidth: 380,
                            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                        }}
                    >
                        <button
                            onClick={() => setShowLogin(false)}
                            style={{
                                position: "absolute", top: 12, right: 16,
                                background: "none", border: "none",
                                fontSize: 20, cursor: "pointer", color: "#9ca3af",
                            }}
                        >✕</button>

                        <h2 style={{ marginBottom: 4, color: "#0a1628", fontWeight: 800, fontSize: 20 }}>
                            Log in
                        </h2>
                        <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 24 }}>
                            One account works across all games.
                        </p>

                        <form onSubmit={handleLogin}>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={loginName}
                                    onChange={e => setLoginName(e.target.value)}
                                    placeholder="Your username"
                                    required
                                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 15, outline: "none", boxSizing: "border-box" }}
                                />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={loginPassword}
                                    onChange={e => setLoginPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 15, outline: "none", boxSizing: "border-box" }}
                                />
                                <div style={{ textAlign: "right", marginTop: 4 }}>
                                    <a href="#/changepassword" onClick={() => setShowLogin(false)} style={{ fontSize: 11, color: "#13447a", textDecoration: "none", fontWeight: 500 }}>
                                        Forgot Password?
                                    </a>
                                </div>
                            </div>

                            {loginError && <p style={{ color: "#dc2626", fontSize: 13, marginBottom: 12 }}>{loginError}</p>}

                            <button
                                type="submit"
                                disabled={loginSubmitting}
                                style={{
                                    width: "100%", padding: "12px",
                                    backgroundColor: loginSubmitting ? "#9ca3af" : "#0a1628",
                                    color: "white", border: "none", borderRadius: 8,
                                    fontWeight: 700, fontSize: 15,
                                    cursor: loginSubmitting ? "default" : "pointer",
                                }}
                            >
                                {loginSubmitting ? "Logging in…" : "Log in"}
                            </button>
                        </form>

                        <p style={{ marginTop: 16, fontSize: 13, color: "#6b7280", textAlign: "center" }}>
                            No account?{" "}
                            <Link to="/signup" onClick={() => setShowLogin(false)} style={{ color: "#0a1628", fontWeight: 600 }}>
                                Create one here
                            </Link>
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}