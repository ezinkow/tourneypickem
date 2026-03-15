import React, { useEffect, useState } from "react";
import axios from "axios";

const GOLD = "#c89d3c";
const BLUE = "#0369a1";

export default function SquaresNumbers() {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("/api/squares/my-numbers")
            .then(res => setData(res.data))
            .finally(() => setLoading(false));
    }, []);

    const sorted = Object.entries(data).sort((a, b) => b[1].length - a[1].length);

    if (loading) return <div style={{ padding: 80, textAlign: "center", color: BLUE }}>Loading...</div>;

    return (
        <div style={{ paddingTop: 68, paddingBottom: 80, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
            <div style={{
                background: `linear-gradient(135deg, #0369a1 0%, #0284c7 100%)`,
                color: "white", padding: "20px 24px", marginBottom: 24,
            }}>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <h2 style={{ margin: 0, color: GOLD, fontWeight: 900 }}>🔢 My Square Numbers</h2>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
                        Numbers assigned after all squares are claimed
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 16px" }}>
                <table style={{ borderCollapse: "collapse", width: "100%", background: "white", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", fontSize: 14 }}>
                    <thead>
                        <tr>
                            {["Name", "Squares", "Count"].map(h => (
                                <th key={h} style={{
                                    padding: "10px 16px", backgroundColor: BLUE, color: "white",
                                    borderBottom: `2px solid ${GOLD}`, textAlign: "left",
                                    fontWeight: 600, fontSize: 13,
                                }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map(([name, squares], i) => (
                            <tr key={name} style={{ backgroundColor: i % 2 === 0 ? "white" : "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                                <td style={{ padding: "10px 16px", fontWeight: 700, color: BLUE, whiteSpace: "nowrap" }}>
                                    {name}
                                </td>
                                <td style={{ padding: "10px 16px", color: "#374151", fontFamily: "monospace", fontSize: 13 }}>
                                    {squares.join(", ")}
                                </td>
                                <td style={{ padding: "10px 16px", fontWeight: 700, color: GOLD, whiteSpace: "nowrap" }}>
                                    {squares.length} · ${squares.length * 25}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}