import React, { useEffect, useState } from "react";
import axios from "axios";

const GOLD = "#c89d3c";
const BLUE = "#0369a1";

const ROUNDS = [
    { round: 1, label: "R1", payout: 12.5 },
    { round: 2, label: "R2", payout: 25 },
    { round: 3, label: "Swt 16", payout: 50 },
    { round: 4, label: "Elite 8", payout: 100 },
    { round: 5, label: "Final 4", payout: 200 },
    { round: 6, label: "Champ", payout: 500 },
];

export default function SquaresResults() {
    const [results, setResults] = useState([]);
    const [numbers, setNumbers] = useState({});
    const [grid, setGrid] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            axios.get("/api/squares/results"),
            axios.get("/api/squares/my-numbers"),
            axios.get("/api/squares/grid"),
        ]).then(([resultsRes, numbersRes, gridRes]) => {
            setResults(resultsRes.data);
            setNumbers(numbersRes.data);
            setGrid(gridRes.data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div style={{ padding: 80, textAlign: "center", color: BLUE }}>Loading results...</div>;

    // Build per-person summary
    const squareCountByOwner = grid.reduce((acc, s) => {
        if (s.owner_name) acc[s.owner_name] = (acc[s.owner_name] || 0) + 1;
        return acc;
    }, {});

    const allOwners = Object.keys(squareCountByOwner).sort();

    const summary = allOwners.map(owner => {
        const squareCount = squareCountByOwner[owner] || 0;
        const cost = squareCount * 25;
        const roundStats = {};
        let totalPayout = 0;

        for (const r of ROUNDS) {
            const wins = results.filter(res => res.owner_name === owner && res.round === r.round);
            const count = wins.length;
            const payout = count * r.payout;
            roundStats[r.round] = { count, payout };
            totalPayout += payout;
        }

        return {
            name: owner,
            numbers: numbers[owner] || [],
            squareCount,
            cost,
            roundStats,
            totalPayout,
            totalNet: totalPayout - cost,
        };
    });

    // Sort by totalPayout desc
    summary.sort((a, b) => b.totalPayout - a.totalPayout);

    const totalPaidOut = summary.reduce((acc, s) => acc + s.totalPayout, 0);

    const thStyle = {
        padding: "8px 10px",
        backgroundColor: BLUE,
        color: "white",
        fontWeight: 600,
        fontSize: 11,
        textAlign: "center",
        whiteSpace: "nowrap",
        borderBottom: `2px solid ${GOLD}`,
        position: "sticky",
        top: 65,
        zIndex: 4,
    };

    const tdStyle = (align = "center") => ({
        padding: "8px 10px",
        fontSize: 12,
        textAlign: align,
        borderBottom: "1px solid #e5e7eb",
        whiteSpace: "nowrap",
    });

    return (
        <div style={{ paddingTop: 68, paddingBottom: 80, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
            {/* Header */}
            <div style={{
                background: `linear-gradient(135deg, ${BLUE} 0%, #0284c7 100%)`,
                color: "white", padding: "20px 24px", marginBottom: 24,
            }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <h2 style={{ margin: 0, color: GOLD, fontWeight: 900 }}>💰 Squares Results</h2>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
                        Last digit of winner's score (col) × last digit of loser's score (row) · ${totalPaidOut.toFixed(2)} paid out so far
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 12px" }}>

                {results.length === 0 && (
                    <p style={{ color: "#6b7280" }}>No results yet — check back once games are final.</p>
                )}

                {/* Main results table */}
                <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                    <table style={{ borderCollapse: "collapse", width: "100%", background: "white", fontSize: 13, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", borderRadius: 8, overflow: "hidden" }}>
                        <thead>
                            <tr>
                                <th style={{ ...thStyle, textAlign: "left" }}>Name</th>
                                <th style={{ ...thStyle, textAlign: "left" }}>Numbers</th>
                                <th style={{ ...thStyle, backgroundColor: "#b45309" }}>Total Pay</th>
                                {ROUNDS.map(r => (
                                    <React.Fragment key={r.round}>
                                        <th style={{ ...thStyle, backgroundColor: getRoundColor(r.round) }}>{r.label} #</th>
                                        <th style={{ ...thStyle, backgroundColor: getRoundColor(r.round) }}>{r.label} $</th>
                                    </React.Fragment>
                                ))}
                                <th style={{ ...thStyle, backgroundColor: "#15803d" }}>Net</th>
                            </tr>
                        </thead>
                        <tbody>
                            {summary.map((row, i) => (
                                <tr key={row.name} style={{ backgroundColor: i % 2 === 0 ? "white" : "#f9fafb" }}>
                                    <td style={{ ...tdStyle("left"), fontWeight: 700, color: BLUE }}>{row.name}</td>
                                    <td style={{ ...tdStyle("left"), fontFamily: "monospace", fontSize: 11, color: "#374151" }}>
                                        {row.numbers.join(", ") || "—"}
                                    </td>
                                    <td style={{ ...tdStyle(), fontWeight: 700, color: "#b45309" }}>
                                        {row.totalPayout > 0 ? `$${row.totalPayout.toFixed(2)}` : "—"}
                                    </td>
                                    {ROUNDS.map(r => {
                                        const { count, payout } = row.roundStats[r.round];
                                        return (
                                            <React.Fragment key={r.round}>
                                                <td style={{ ...tdStyle(), color: count > 0 ? "#15803d" : "#d1d5db", fontWeight: count > 0 ? 700 : 400 }}>
                                                    {count > 0 ? count : "—"}
                                                </td>
                                                <td style={{ ...tdStyle(), color: payout > 0 ? "#15803d" : "#d1d5db", fontWeight: payout > 0 ? 700 : 400 }}>
                                                    {payout > 0 ? `$${payout.toFixed(2)}` : "—"}
                                                </td>
                                            </React.Fragment>
                                        );
                                    })}
                                    <td style={{
                                        ...tdStyle(),
                                        fontWeight: 800,
                                        color: row.totalNet > 0 ? "#15803d" : row.totalNet < 0 ? "#dc2626" : "#6b7280",
                                        backgroundColor: row.totalNet > 0 ? "#f0fdf4" : row.totalNet < 0 ? "#fef2f2" : "transparent",
                                    }}>
                                        {row.totalNet >= 0 ? `+$${row.totalNet.toFixed(2)}` : `-$${Math.abs(row.totalNet).toFixed(2)}`}
                                    </td>
                                </tr>
                            ))}

                            {/* Totals row */}
                            <tr style={{ backgroundColor: "#f8fafc", borderTop: `2px solid ${GOLD}` }}>
                                <td style={{ ...tdStyle("left"), fontWeight: 800 }} colSpan={2}>Totals</td>
                                <td style={{ ...tdStyle(), fontWeight: 800, color: "#b45309" }}>${totalPaidOut.toFixed(2)}</td>
                                {ROUNDS.map(r => {
                                    const totalCount = summary.reduce((acc, s) => acc + s.roundStats[r.round].count, 0);
                                    const totalPay = summary.reduce((acc, s) => acc + s.roundStats[r.round].payout, 0);
                                    return (
                                        <React.Fragment key={r.round}>
                                            <td style={{ ...tdStyle(), fontWeight: 700 }}>{totalCount || "—"}</td>
                                            <td style={{ ...tdStyle(), fontWeight: 700 }}>{totalPay > 0 ? `$${totalPay.toFixed(2)}` : "—"}</td>
                                        </React.Fragment>
                                    );
                                })}
                                <td style={{ ...tdStyle() }} />
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Per-game detail */}
                {results.length > 0 && (
                    <div style={{ marginTop: 40 }}>
                        <h3 style={{ color: BLUE, marginBottom: 16 }}>📋 Game-by-Game Detail</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {results.map(r => (
                                <div key={r.game_id} style={{
                                    background: "white", borderRadius: 10, padding: "12px 16px",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    flexWrap: "wrap", gap: 8,
                                    borderLeft: `4px solid ${getRoundColorHex(r.round)}`,
                                }}>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 13, color: "#1f2937" }}>
                                            {r.winner} def. {r.home_team === r.winner ? r.away_team : r.home_team}
                                        </div>
                                        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
                                            {r.round_label} · Final: {r.away_team} {r.away_score} – {r.home_score} {r.home_team}
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                        <div style={{ textAlign: "center" }}>
                                            <div style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase" }}>Square</div>
                                            <div style={{ fontSize: 16, fontWeight: 900, color: BLUE }}>{r.win_digit}-{r.lose_digit}</div>
                                        </div>
                                        <div style={{ textAlign: "center" }}>
                                            <div style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase" }}>Winner</div>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: r.owner_name ? "#15803d" : "#9ca3af" }}>
                                                {r.owner_name || "Unclaimed"}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: "center" }}>
                                            <div style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase" }}>Payout</div>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: GOLD }}>${r.payout}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function getRoundColor(round) {
    const colors = { 1: "#92400e", 2: "#b45309", 3: "#d97706", 4: "#ca8a04", 5: "#0369a1", 6: "#7c3aed" };
    return colors[round] || "#6b7280";
}

function getRoundColorHex(round) {
    const colors = { 1: "#fef3c7", 2: "#fde68a", 3: "#fcd34d", 4: "#f59e0b", 5: "#0369a1", 6: "#7c3aed" };
    return colors[round] || "#e5e7eb";
}