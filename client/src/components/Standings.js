import React, { useEffect, useState } from "react";
import axios from "axios";

const Standings = () => {
    const [standings, setStandings] = useState([]);

    useEffect(() => {
        axios.get("/api/standings").then(res => setStandings(res.data));
    }, []);

      useEffect(() => {
        document.body.classList.add("force-mobile");
        return () => document.body.classList.remove("force-mobile");
      }, []);

    return (
        <div style={{ paddingTop: 68, paddingBottom: 80, padding: "68px 12px 80px" }}>
            <h2 style={{ color: "var(--primary-navy)", paddingBottom: 6 }}>Standings</h2>
            <table style={{ borderCollapse: "collapse", background: "white", width: "100%", fontSize: 14 }}>
                <thead>
                    <tr>
                        {["Rank", "Player", "Points", "Correct", "Correct Missed"].map(h => (
                            <th key={h} style={{
                                position: "sticky",
                                top: 65,
                                zIndex: 4,
                                backgroundColor: "#13447a",
                                color: "white",
                                borderBottom: "2px solid #c89d3c",
                                padding: "10px 14px",
                                textAlign: "center",
                                whiteSpace: "nowrap",
                                textTransform: "uppercase",
                                fontSize: 12,
                                letterSpacing: "0.5px",
                            }}>
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {standings.map((s, idx) => (
                        <tr key={s.user_id} style={{
                            backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9fafb", textAlign: "center"
                        }}>
                            <td style={{ padding: "10px 14px", borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap" }}>
                                {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
                            </td>
                            <td style={{ padding: "10px 14px", borderBottom: "1px solid #e5e7eb", fontWeight: 600, color: "var(--primary-navy)" }}>
                                {s.name}
                            </td>
                            <td style={{ padding: "10px 14px", borderBottom: "1px solid #e5e7eb", fontWeight: 700 }}>
                                {s.points}
                            </td>
                            <td style={{ padding: "10px 14px", borderBottom: "1px solid #e5e7eb" }}>
                                {s.correct}
                            </td>
                            <td style={{ padding: "10px 14px", borderBottom: "1px solid #e5e7eb" }}>
                                {s.missed}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Standings;