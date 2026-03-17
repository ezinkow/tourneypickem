import React, { useEffect, useState } from "react";
import axios from "axios";

const GOLD = "#c89d3c";
const BLUE = "#13447a";

export default function BracketStandings() {
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("/api/bracket/standings")
            .then(res => setStandings(res.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div style={{ padding: 80, textAlign: "center", color: BLUE }}>Loading standings...</div>;

    return (
        <div style={{ paddingTop: 68, paddingBottom: 80, maxWidth: 800, margin: "0 auto", padding: "68px 16px 80px" }}>
            <h2 style={{ color: BLUE, marginBottom: 4 }}>🏆 Bracket Standings</h2>
            <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 20 }}>
                Points: 1pt R1 · 2pt R2 · 4pt Sweet 16 · 8pt Elite 8 · 16pt Final Four · 32pt Championship
                <br />PLUS: Team's seed value
            </p>

            {standings.length === 0 && (
                <p style={{ color: "#6b7280" }}>No picks submitted yet.</p>
            )}

            {/* Desktop table */}
            <div className="mypicks-desktop">
                <table style={{
                    borderCollapse: "collapse", width: "100%", background: "white",
                    fontSize: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
                }}>
                    <thead>
                        <tr>
                            {["Rank", "Name", "Points", "Correct", "Champ"].map(h => (
                                <th key={h} style={{
                                    position: "sticky", top: 65, zIndex: 4,
                                    padding: "10px 14px",
                                    backgroundColor: BLUE,
                                    color: "white",
                                    borderBottom: `2px solid ${GOLD}`,
                                    textAlign: "left",
                                    whiteSpace: "nowrap",
                                    fontWeight: 600,
                                    fontSize: 13,
                                }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {standings.map((s, i) => (
                            <tr key={s.name} style={{
                                backgroundColor: i % 2 === 0 ? "white" : "#f9fafb",
                                borderBottom: "1px solid #e5e7eb",
                            }}>
                                <td style={{ padding: "10px 14px", fontWeight: 700, color: i === 0 ? GOLD : "#374151" }}>
                                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                                </td>
                                <td style={{ padding: "10px 14px", fontWeight: 600 }}>{s.name}</td>
                                <td style={{ padding: "10px 14px", fontWeight: 700, color: BLUE }}>{s.points}</td>
                                <td style={{ padding: "10px 14px", color: "#16a34a", fontWeight: 600 }}>{s.correct}</td>
                                <td style={{ padding: "10px 14px", color: "#374151" }}>
                                    {s.predictedWinner
                                        ? <span style={{ fontWeight: 600 }}>🏆 {s.predictedWinner}</span>
                                        : <span style={{ color: "#9ca3af" }}>—</span>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile cards */}
            <div className="mypicks-mobile">
                {standings.map((s, i) => (
                    <div key={s.name} style={{
                        background: "white",
                        borderRadius: 12,
                        padding: "14px 16px",
                        marginBottom: 10,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                        borderLeft: `4px solid ${i === 0 ? GOLD : BLUE}`,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                <span style={{ fontSize: 18 }}>
                                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                                </span>
                                <span style={{ fontWeight: 700, fontSize: 15 }}>{s.name}</span>
                            </div>
                            {s.predictedWinner && (
                                <div style={{ fontSize: 12, color: "#6b7280" }}>
                                    🏆 {s.predictedWinner}
                                </div>
                            )}
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div style={{ fontWeight: 800, fontSize: 20, color: BLUE }}>{s.points}</div>
                            <div style={{ fontSize: 11, color: "#16a34a", fontWeight: 600 }}>{s.correct} correct</div>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
}