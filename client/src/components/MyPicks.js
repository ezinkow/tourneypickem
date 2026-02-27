import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import toast, { Toaster } from "react-hot-toast";

export default function MyPicks() {
    const [names, setNames] = useState([]);
    const [name, setName] = useState("SELECT YOUR NAME");
    const [password, setPassword] = useState("");
    const [authenticated, setAuthenticated] = useState(false);
    const [picks, setPicks] = useState([]);
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(false);

    /* ---------- Load Names ---------- */
    useEffect(() => {
        axios.get("/api/users").then(r => setNames(r.data));
        axios.get("/api/standings").then(r => setStandings(r.data));
    }, []);

    /* ---------- Verify ---------- */
    const verify = async () => {
        try {
            const res = await axios.post("/api/users/verify", { name, password });
            if (!res.data.success) return toast.error("Wrong password");

            setAuthenticated(true);
            fetchPicks();
        } catch {
            toast.error("Verify failed");
        }
    };

    /* ---------- Fetch Picks ---------- */
    const fetchPicks = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/mypicks", { params: { name } });
            // Sort by game_date in ascending order
            const sortedData = (res.data || []).sort((a, b) => {
                return new Date(a.game_date) - new Date(b.game_date);
            });
            console.log("MYPICKS:", sortedData);
            setPicks(sortedData || []);
        } catch {
            toast.error("Failed loading picks");
        } finally {
            setLoading(false);
        }
    };

    /* ---------- Points ---------- */
    const myStanding = standings.find(s => s.name === name);

    /* ---------- Helpers ---------- */
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

    let fav_logo = ''
    let dog_logo = ''

    const getFavoriteLogo = (p) => {
        const game = p.Game;

        if (game.home_team === game.favorite) return p.home_logo
        if (game.away_team === game.favorite) return p.away_logo
        return null;
    }
    console.log(fav_logo)

    // Result Logic Helper
    const renderResultIcon = (p) => {
        // Access the associated Game data
        const game = p.Game;

        // Don't show icons if game isn't over or data is missing
        if (!game || game.status !== "STATUS_FINAL" || !game.winner) {
            return null;
        }

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

    /* ---------- Render ---------- */
    return (
        <div className="container" style={{ maxWidth: 900 }}>
            <Toaster />

            <h2>🏀 My Picks</h2>

            {!authenticated && (
                <div style={{ display: "flex", gap: 10 }}>
                    <Dropdown onSelect={setName}>
                        <Dropdown.Toggle>{name}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {names.map(n => (
                                <Dropdown.Item key={n.name} eventKey={n.name}>
                                    {n.name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>

                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                    />

                    <Button onClick={verify}>Verify</Button>
                </div>
            )}

            {authenticated && (
                <>
                    <h4>
                        {name} — {myStanding?.points || 0} pts
                    </h4>

                    {loading && <p>Loading...</p>}

                    {!loading && picks.length === 0 && (
                        <p>No picks found.</p>
                    )}

                    {!loading && picks.length > 0 && (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Matchup</th>
                                    <th>Line</th>
                                    <th>Status/Score</th>
                                    <th>Winner (ATS)</th>
                                    <th>Your Pick</th>
                                </tr>
                            </thead>

                            <tbody>
                                {picks.map((p, i) => (
                                    <tr key={i}>
                                        <td>
                                            <img src={p.away_logo} height={22} />
                                            {" @ "}
                                            <img src={p.home_logo} height={22} />
                                        </td>

                                        <td>
                                            <img
                                                src={getFavoriteLogo(p)}
                                                height={24}
                                                style={{ borderRadius: 4 }}
                                            /> (-{p.line})
                                        </td>

                                        <td>
                                            {/* If live or finished, show the status and the scores */}
                                            {(p.Game?.status === "STATUS_FINAL" || p.Game?.status === "STATUS_IN_PROGRESS") ? (
                                                <>
                                                    {p.Game?.status === "STATUS_FINAL" ? "Final: " : `${p.game_clock}: `}
                                                    <img src={p.away_logo} height={22} alt="away" /> {p.away_score}-{p.home_score} <img src={p.home_logo} height={22} alt="home" />
                                                </>
                                            ) : (
                                                /* If the game hasn't started yet, just show the time/clock detail */
                                                <span>{p.game_clock || "Scheduled"}</span>
                                            )}
                                        </td>
                                        {/* Winner */}
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