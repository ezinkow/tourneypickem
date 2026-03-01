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

    /* ---------- Initial Load ---------- */
    useEffect(() => {
        axios.get("/api/users").then(r => setUsers(r.data));
        axios.get("/api/standings").then(r => setStandings(r.data));
    }, []);

    /* ---------- Authentication Logic ---------- */
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

    /* ---------- Fetch Picks ---------- */
    const fetchPicks = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/mypicks", { params: { name: user } });
            const sortedData = (res.data || []).sort((a, b) => {
                return new Date(a.game_date) - new Date(b.game_date);
            });
            setPicks(sortedData || []);
        } catch {
            toast.error("Failed loading picks");
        } finally {
            setLoading(false);
        }
    };

    /* ---------- Points Logic ---------- */
    const myStanding = standings.find(s => s.name === user);

    /* ---------- Helper Functions ---------- */
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
    }

    const renderResultIcon = (p) => {
        const game = p.Game;
        if (!game || game.status !== "STATUS_FINAL" || !game.winner) return null;

        if (game.winner === "PUSH") {
            return <span style={{ marginLeft: "8px", color: "orange" }}>➖</span>;
        }

        const isCorrect = p.pick === game.winner;
        return isCorrect ? (
            <span style={{ marginLeft: "8px", color: "green", fontWeight: "bold" }}>✅</span>
        ) : (
            <span style={{ marginLeft: "8px", color: "red", fontWeight: "bold" }}>❌</span>
        );
    };

    return (
        <div className="container" style={{ maxWidth: 1000 }}>
            <Toaster />

            <h2>🏀 My Picks</h2>

            {/* --- Auth Section (Matches Picks Style) --- */}
            {!authenticated && (
                <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                    <Dropdown onSelect={setUser}>
                        <Dropdown.Toggle variant="outline-primary">{user}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {users.map(n => (
                                <Dropdown.Item key={n.name} eventKey={n.name}>
                                    {n.name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>

                    <input
                        type="password"
                        className="form-control"
                        style={{ width: "200px" }}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                    />

                    <Button onClick={verify}>Verify Identity</Button>
                </div>
            )}

            {/* --- My Picks Display Section --- */}
            {authenticated && (
                <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <h4>{user}</h4>
                        <h5 style={{ color: "#666" }}>Total Points: {myStanding?.points || 0}</h5>
                    </div>

                    {loading && <p>Loading your picks...</p>}

                    {!loading && picks.length === 0 && (
                        <p className="mt-4">No picks found for this user.</p>
                    )}

                    {!loading && picks.length > 0 && (
                        <Table striped bordered hover responsive className="mt-2">
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
                                    <tr key={i}>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                                <img src={p.away_logo} height={22} alt="" />
                                                {" @ "}
                                                <img src={p.home_logo} height={22} alt="" />
                                            </div>
                                        </td>

                                        <td>
                                            {getFavoriteLogo(p) ? (
                                                <>
                                                    <img
                                                        src={getFavoriteLogo(p)}
                                                        height={24}
                                                        style={{ borderRadius: 4, marginRight: 5 }}
                                                        alt="fav"
                                                    />
                                                    (-{p.line})
                                                </>
                                            ) : (
                                                `-${p.line}`
                                            )}
                                        </td>

                                        <td>
                                            {(p.Game?.status === "STATUS_FINAL" || p.Game?.status === "STATUS_IN_PROGRESS") ? (
                                                <div style={{ whiteSpace: "nowrap" }}>
                                                    <span style={{ fontWeight: p.Game?.status === "STATUS_IN_PROGRESS" ? "bold" : "normal" }}>
                                                        {p.Game?.status === "STATUS_FINAL" ? "Final: " : `${p.game_clock}: `}
                                                    </span>
                                                    <img src={p.away_logo} height={22} style={{ margin: "0 4px" }} alt="" />
                                                    {p.away_score} - {p.home_score}
                                                    <img src={p.home_logo} height={22} style={{ margin: "0 4px" }} alt="" />
                                                </div>
                                            ) : (
                                                <span style={{ color: "#666" }}>{p.game_clock || "Scheduled"}</span>
                                            )}
                                        </td>

                                        <td style={{ textAlign: "center" }}>
                                            {p.Game?.winner === "PUSH" ? (
                                                <span style={{ fontSize: "12px", fontWeight: "bold" }}>PUSH</span>
                                            ) : getWinnerLogo(p) ? (
                                                <img
                                                    src={getWinnerLogo(p)}
                                                    height={24}
                                                    alt="winner"
                                                    style={{ borderRadius: 4 }}
                                                />
                                            ) : (
                                                "—"
                                            )}
                                        </td>

                                        <td>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <img
                                                    src={getPickLogo(p)}
                                                    height={24}
                                                    style={{ borderRadius: 4 }}
                                                    alt="pick"
                                                />
                                                {renderResultIcon(p)}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </>
            )}
        </div>
    );
}