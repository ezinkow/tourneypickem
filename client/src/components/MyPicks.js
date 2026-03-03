import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import toast, { Toaster } from "react-hot-toast";

export default function MyPicks() {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState("SELECT YOUR NAME");
    const [password, setPassword] = useState("");
    const [authenticated, setAuthenticated] = useState(false);
    const [picks, setPicks] = useState([]);
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get("/api/users").then(r => setUsers(r.data));
        axios.get("/api/standings").then(r => setStandings(r.data));
    }, []);

    const verify = async () => {
        try {
            const res = await axios.post("/api/users/verify", { name: user, password });
            if (!res.data.success) return toast.error("Wrong password");
            setAuthenticated(true);
            toast.success("Identity verified!");
            fetchPicks();
        } catch {
            toast.error("Verify failed");
        }
    };

    const fetchPicks = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/mypicks", { params: { name: user } });
            const sortedData = (res.data || []).sort((b, a) => new Date(a.game_date) - new Date(b.game_date));
            setPicks(sortedData || []);
        } catch {
            toast.error("Failed loading picks");
        } finally {
            setLoading(false);
        }
    };

    const myStanding = standings.find(s => s.name === user);

    const getPickLogo = (p) => {
        if (p.pick === p.home_team) return p.home_logo;
        if (p.pick === p.away_team) return p.away_logo;
        return null;
    };

    const getWinnerLogo = (p) => {
        const game = p.Game;
        if (!game || !game.winner || game.winner === "PUSH") return null;
        if (game.winner === p.home_team) return p.home_logo;
        if (game.winner === p.away_team) return p.away_logo;
        return null;
    };

    const getFavoriteLogo = (p) => {
        const game = p.Game;
        if (!game) return null;
        if (game.home_team === game.favorite) return p.home_logo;
        if (game.away_team === game.favorite) return p.away_logo;
        return null;
    };

    const renderResultIcon = (p) => {
        const game = p.Game;
        if (!game || game.status !== "STATUS_FINAL" || !game.winner) return null;
        if (game.winner === "PUSH") return <span style={{ color: "orange" }}>➖</span>;
        return p.pick === game.winner
            ? <span style={{ color: "green", fontWeight: "bold" }}>✅</span>
            : <span style={{ color: "red", fontWeight: "bold" }}>❌</span>;
    };

    const getRowClass = (p) => {
        if (!p.Game?.winner) return "";
        if (p.pick === p.Game.winner) return "pick-win";
        if (p.missed_pick_flag) return "pick-missed";
        return "pick-loss";
    };

    const PickCard = ({ p }) => {
        const game = p.Game;
        const isFinal = game?.status === "STATUS_FINAL";
        const isLive = game?.status === "STATUS_IN_PROGRESS";
        const rowClass = getRowClass(p);

        const borderColor = rowClass === "pick-win" ? "#86efac"
            : rowClass === "pick-loss" ? "#fca5a5"
                : rowClass === "pick-missed" ? "#fde68a"
                    : "#e5e7eb";

        return (
            <div style={{
                background: "var(--white)",
                borderRadius: 12,
                padding: "12px 14px",
                borderLeft: `4px solid ${borderColor}`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
            }}>
                {/* Row 1: Matchup + status badge */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <img src={p.away_logo} height={22} alt="" />
                        <span style={{ fontSize: 12, color: "#9ca3af" }}>@</span>
                        <img src={p.home_logo} height={22} alt="" />
                    </div>
                    <span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 20,
                        background: isLive ? "#fef2f2" : isFinal ? "#f0fdf4" : "#f3f4f6",
                        color: isLive ? "#dc2626" : isFinal ? "#16a34a" : "#6b7280",
                    }}>
                        {isLive ? "🔴 LIVE" : isFinal ? "Final" : game?.game_clock || "Scheduled"}
                    </span>
                </div>

                {/* Row 2: Score (if started) */}
                {(isFinal || isLive) && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700 }}>
                        <img src={p.away_logo} height={18} alt="" />
                        <span>{p.away_score} – {p.home_score}</span>
                        <img src={p.home_logo} height={18} alt="" />
                    </div>
                )}

                {/* Row 3: Line | Winner | Your Pick */}
                <div style={{ display: "flex", gap: 16, fontSize: 12, alignItems: "center" }}>
                    {/* Line */}
                    <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#374151" }}>
                        <span style={{ color: "#9ca3af", fontSize: 10, textTransform: "uppercase" }}>Line</span>
                        {getFavoriteLogo(p) && <img src={getFavoriteLogo(p)} height={16} alt="" />}
                        <span>(-{p.line})</span>
                    </div>

                    {/* Winner ATS */}
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ color: "#9ca3af", fontSize: 10, textTransform: "uppercase" }}>Cvrd</span>
                        {p.Game?.winner === "PUSH" ? (
                            <span style={{ fontSize: 11, fontWeight: "bold" }}>PUSH</span>
                        ) : getWinnerLogo(p) ? (
                            <img src={getWinnerLogo(p)} height={18} alt="winner" />
                        ) : "—"}
                    </div>

                    {/* Your pick */}
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>
                        <span style={{ color: "#9ca3af", fontSize: 10, textTransform: "uppercase" }}>Pick</span>
                        {getPickLogo(p) && <img src={getPickLogo(p)} height={20} alt="pick" />}
                        {renderResultIcon(p)}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container" style={{ maxWidth: 1000 }}>
            <Toaster />
            <h2>🏀 My Picks 📝</h2>

            {!authenticated && (
                <form className="auth-container" onSubmit={(e) => { e.preventDefault(); verify(); }}>
                    <Dropdown onSelect={setUser}>
                        <Dropdown.Toggle variant="outline-primary">{user}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {users.map(n => (
                                <Dropdown.Item key={n.name} eventKey={n.name}>{n.name}</Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <input
                        type="password"
                        className="form-control auth-input"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <Button type="submit">Verify Identity</Button>
                </form>
            )}

            {authenticated && (
                <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <h4>{user}</h4>
                        <h5 style={{ color: "#666" }}>Total Points: {myStanding?.points || 0}</h5>
                    </div>

                    {loading && <p>Loading your picks...</p>}
                    {!loading && picks.length === 0 && <p className="mt-4">No picks found.</p>}

                    {!loading && picks.length > 0 && (
                        <>
                            {/* DESKTOP TABLE */}
                            <div className="mypicks-desktop">
                                <Table striped bordered hover responsive className="mt-2 table-wrapper">
                                    <thead>
                                        <tr>
                                            <th>Matchup</th>
                                            <th>Line</th>
                                            <th>Status / Score</th>
                                            <th>Winner (ATS)</th>
                                            <th>Your Pick</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {picks.map((p, i) => (
                                            <tr className={getRowClass(p)} key={i}>
                                                <td>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                                        <img src={p.away_logo} height={22} alt="" />
                                                        {" @ "}
                                                        <img src={p.home_logo} height={22} alt="" />
                                                    </div>
                                                </td>
                                                <td>
                                                    {getFavoriteLogo(p) ? (
                                                        <>
                                                            <img src={getFavoriteLogo(p)} height={24} style={{ borderRadius: 4, marginRight: 5 }} alt="fav" />
                                                            (-{p.line})
                                                        </>
                                                    ) : `-${p.line}`}
                                                </td>
                                                <td>
                                                    {(p.Game?.status === "STATUS_FINAL" || p.Game?.status === "STATUS_IN_PROGRESS") ? (
                                                        <div style={{ whiteSpace: "nowrap" }}>
                                                            <span style={{ fontWeight: p.Game?.status === "STATUS_IN_PROGRESS" ? "bold" : "normal" }}>
                                                                {p.Game?.status === "STATUS_FINAL" ? "Final: " : `${p.Game.game_clock}: `}
                                                            </span>
                                                            <img src={p.away_logo} height={22} style={{ margin: "0 4px" }} alt="" />
                                                            {p.away_score} - {p.home_score}
                                                            <img src={p.home_logo} height={22} style={{ margin: "0 4px" }} alt="" />
                                                        </div>
                                                    ) : (
                                                        <span style={{ color: "#666" }}>{p.Game?.game_clock || "Scheduled"}</span>
                                                    )}
                                                </td>
                                                <td style={{ textAlign: "center" }}>
                                                    {p.Game?.winner === "PUSH" ? (
                                                        <span style={{ fontSize: 12, fontWeight: "bold" }}>PUSH</span>
                                                    ) : getWinnerLogo(p) ? (
                                                        <img src={getWinnerLogo(p)} height={24} alt="winner" style={{ borderRadius: 4 }} />
                                                    ) : "—"}
                                                </td>
                                                <td>
                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                        <img src={getPickLogo(p)} height={24} style={{ borderRadius: 4 }} alt="pick" />
                                                        {renderResultIcon(p)}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>

                            {/* MOBILE CARDS */}
                            <div className="mypicks-mobile">
                                {picks.map((p, i) => <PickCard key={i} p={p} />)}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}