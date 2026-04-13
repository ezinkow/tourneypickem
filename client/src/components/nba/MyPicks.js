import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

export default function MyPicks() {
    const { user: authUser, logout, loading: authLoading } = useAuth();
    const [picks, setPicks] = useState([]);
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (authUser) {
            fetchData();
        }
    }, [authUser]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Get Picks and Standings in parallel
            // Note: Ensure your backend /api/nba/picks includes the series alias
            const [picksRes, standingsRes] = await Promise.all([
                axios.get("/api/nba/picks", { params: { name: authUser.name } }),
                axios.get("/api/nba/standings")
            ]);
            setPicks(picksRes.data || []);
            setStandings(standingsRes.data || []);
        } catch (err) {
            toast.error("Failed to load your data");
        } finally {
            setLoading(false);
        }
    };

    const myStanding = standings.find(s => s.entry_name === authUser?.name || s.name === authUser?.name);

    // Calculate total points assigned across all current picks
    const totalConfidenceAssigned = useMemo(() => {
        return picks.reduce((sum, p) => sum + (parseInt(p.confidence) || 0), 0);
    }, [picks]);

    // --- Helper Functions ---
    const getPickLogo = (p) => {
        const s = p.series;
        if (!s) return null;
        return p.pick === s.home_team ? s.home_logo : s.away_logo;
    };

    const getResultIcon = (p) => {
        const s = p.series;
        if (!s || s.status !== "STATUS_FINAL" || !s.winner) return null;
        return p.pick === s.winner ? "✅" : "❌";
    };

    const getRowBg = (p) => {
        const s = p.series;
        if (!s || s.status !== "STATUS_FINAL") return "white";
        return p.pick === s.winner ? "#f0fdf4" : "#fef2f2";
    };

    const renderSeriesStatus = (s) => {
        if (!s) return "N/A";
        const { away_wins, home_wins, away_team, home_team, status } = s;

        if (status === "STATUS_FINAL") {
            return <span style={{ fontWeight: 700, color: "#16a34a" }}>Final: {away_wins}-{home_wins}</span>;
        }

        if (away_wins === 0 && home_wins === 0) {
            return <span style={{ color: "#9ca3af" }}>Series Scheduled</span>;
        }

        if (away_wins === home_wins) {
            return <span style={{ fontWeight: 600 }}>Series Tied {away_wins}-{home_wins}</span>;
        }

        const leader = away_wins > home_wins ? away_team : home_team;
        const max = Math.max(away_wins, home_wins);
        const min = Math.min(away_wins, home_wins);

        return (
            <span>
                <span style={{ color: "#dc2626", fontSize: 10, fontWeight: 800 }}>LIVE </span>
                <strong>{leader}</strong> leads {max}-{min}
            </span>
        );
    };

    if (authLoading) return <div style={{ paddingTop: 100, textAlign: "center" }}>Verifying Session...</div>;
    if (!authUser) return <div style={{ paddingTop: 100, textAlign: "center" }}><h3>Please log in.</h3></div>;

    return (
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "68px 16px 80px" }}>
            <Toaster />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
                <div>
                    <h2 style={{ color: "#13447a", margin: 0 }}>🏀 My Picks</h2>
                    <p style={{ color: "#666", margin: "4px 0" }}>Logged in as: <strong>{authUser.name}</strong></p>
                    <div style={{ fontSize: 13, color: "#13447a", fontWeight: 600 }}>
                        Total Confidence Assigned: {totalConfidenceAssigned} pts
                    </div>
                </div>
                <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#13447a" }}>
                        Live Standing Score: {myStanding?.points || 0} pts
                    </div>
                    <button onClick={logout} style={{ marginTop: 8, fontSize: 12, padding: "4px 12px", borderRadius: 6, border: "1px solid #d1d5db", cursor: "pointer", background: "white" }}>
                        Log Out
                    </button>
                </div>
            </div>

            {loading ? (
                <p>Loading your picks...</p>
            ) : picks.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", background: "#f9fafb", borderRadius: 12, border: "2px dashed #d1d5db" }}>
                    <p style={{ color: "#6b7280", fontWeight: 600 }}>You haven't made any picks for this round yet.</p>
                    <button
                        onClick={() => window.location.hash = "#/nba/picks"}
                        style={{ padding: "10px 20px", backgroundColor: "#13447a", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}
                    >
                        Go to Picks Page
                    </button>
                </div>
            ) : (
                <div className="table-responsive" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderRadius: 8 }}>
                    <table style={{ borderCollapse: "collapse", width: "100%", background: "white", overflow: "hidden" }}>
                        <thead style={{ backgroundColor: "#13447a", color: "white" }}>
                            <tr>
                                <th style={{ padding: 14, textAlign: "left" }}>Matchup</th>
                                <th style={{ padding: 14, textAlign: "left" }}>Series Status</th>
                                <th style={{ padding: 14, textAlign: "center" }}>Confidence</th>
                                <th style={{ padding: 14, textAlign: "center" }}>Your Pick</th>
                                <th style={{ padding: 14, textAlign: "center" }}>Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            {picks.map((p, i) => (
                                <tr key={i} style={{ backgroundColor: getRowBg(p), borderBottom: "1px solid #f3f4f6" }}>
                                    <td style={{ padding: 14 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <img src={p.series?.away_logo} height={22} alt="" />
                                            <span style={{ fontSize: 13, fontWeight: 500 }}>{p.series?.away_team} @ {p.series?.home_team}</span>
                                            <img src={p.series?.home_logo} height={22} alt="" />
                                        </div>
                                    </td>
                                    <td style={{ padding: 14, fontSize: 13 }}>
                                        {renderSeriesStatus(p.series)}
                                    </td>
                                    <td style={{ padding: 14, textAlign: "center", fontWeight: 800, color: "#13447a" }}>
                                        {p.confidence}
                                    </td>
                                    <td style={{ padding: 14, textAlign: "center" }}>
                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6 }}>
                                            <img src={getPickLogo(p)} height={22} alt="" />
                                            <span style={{ fontSize: 12 }}>in <strong>{p.series_length_guess}</strong></span>
                                        </div>
                                    </td>
                                    <td style={{ padding: 14, textAlign: "center", fontSize: 20 }}>
                                        {getResultIcon(p)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}