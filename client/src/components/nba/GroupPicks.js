import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import NbaGatekeeper from "../../components/nba/NbaGatekeeper";

// NBA Colors
const NAVY = "#0a1628";
const GOLD = "#c89d3c";
const RED = "#c8102e";

export default function PlayerPicksMatrix() {
  const [series, setSeries] = useState([]);
  const [picks, setPicks] = useState([]);
  const [standings, setStandings] = useState([]);
  const [tiebreakers, setTiebreakers] = useState([]);

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [seriesRes, picksRes, standingsRes, tbRes] = await Promise.all([
          axios.get("/api/nba/series"),
          axios.get("/api/nba/picks/all"),
          axios.get("/api/nba/standings"),
          axios.get("/api/nba/tiebreaker/all"),
        ]);

        // Only show series that have at least started or are locked to avoid spoilers
        setSeries(seriesRes.data.filter(s => s.locked || s.status !== "STATUS_SCHEDULED"));
        setPicks(picksRes.data);
        setStandings(standingsRes.data.sort((a, b) => b.points - a.points));
        setTiebreakers(tbRes.data);
      } catch (err) {
        console.error("Matrix load failed", err);
      }
    };

    fetchAll();
    const interval = setInterval(fetchAll, 60000 * 5); // Refresh every 5 mins
    return () => clearInterval(interval);
  }, []);

  
  // Maps for O(1) lookups in the table grid
  const pickMap = useMemo(() => {
    const map = {};
    picks.forEach(p => {
      if (!map[p.series_id]) map[p.series_id] = {};
      map[p.series_id][p.entry_name] = p;
    });
    return map;
  }, [picks]);
  
  const tbMap = useMemo(() => {
    const map = {};
    tiebreakers.forEach(t => { map[t.entry_name] = t; });
    return map;
  }, [tiebreakers]);
  
  if (authLoading) return null;
  
  const getCellStyle = (s, pick) => {
    if (!pick || s.status !== "STATUS_FINAL") return { backgroundColor: "white" };
    const correctWinner = pick.pick === s.winner;
    if (correctWinner) {
      // If they also got the series length right, make it gold
      return pick.series_length_guess === s.series_length
        ? { backgroundColor: "#fef9c3", border: `1px solid ${GOLD}` }
        : { backgroundColor: "#dcfce7" };
    }
    return { backgroundColor: "#fee2e2" };
  };

  return (
    <NbaGatekeeper user={user}>
      <div style={{ paddingTop: 110, paddingBottom: 80, overflowX: "auto" }}>
        {/* Legend Header */}
        <div style={{ position: "fixed", top: 65, left: 0, right: 0, zIndex: 10, backgroundColor: "#f8f9fa", padding: "10px 15px", borderBottom: `2px solid ${GOLD}`, display: "flex", gap: 20, alignItems: "center" }}>
          <h4 style={{ margin: 0, fontSize: 16 }}>Group Picks</h4>
          <div style={{ display: "flex", gap: 10, fontSize: 12 }}>
            <span><span style={{ color: "#22c55e" }}>●</span> Correct</span>
            <span><span style={{ color: "#eab308" }}>●</span> Perfect (x2)</span>
            <span><span style={{ color: "#ef4444" }}>●</span> Wrong</span>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white", tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th style={stickyHeaderStyle(0, 100, 120)}>Player</th>
              {series.map(s => (
                <th key={s.id} style={gameHeaderStyle}>
                  <div style={{ fontSize: 10, marginBottom: 4 }}>{s.round_label}</div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
                    <img src={s.away_logo} height={18} alt="" />
                    <span style={{ fontSize: 9 }}>vs</span>
                    <img src={s.home_logo} height={18} alt="" />
                  </div>
                  {s.status === "STATUS_FINAL" && (
                    <div style={{ fontSize: 10, color: GOLD }}>{s.away_wins}-{s.home_wins}</div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {standings.map((user, idx) => {
              const userTb = tbMap[user.entry_name];
              return (
                <tr key={user.entry_name} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={stickyColumnStyle}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{idx + 1}. {user.entry_name}</div>
                    <div style={{ fontSize: 11, color: "#666" }}>{user.points} pts</div>
                  </td>

                  {series.map(s => {
                    const p = pickMap[s.id]?.[user.entry_name];
                    return (
                      <td key={s.id} style={{ ...cellStyle, ...getCellStyle(s, p) }}>
                        {p ? (
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <img
                              src={p.pick === s.home_team ? s.home_logo : s.away_logo}
                              height={22}
                              alt=""
                            />
                            <div style={{ fontSize: 10, fontWeight: 700 }}>{p.confidence} pts</div>
                            <div style={{ fontSize: 9, color: "#666" }}>in {p.series_length_guess}</div>
                          </div>
                        ) : <span style={{ color: "#ccc" }}>—</span>}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </NbaGatekeeper>
  );
}

// --- Internal Styles ---
const stickyHeaderStyle = (left, zIndex, width) => ({
  position: "sticky",
  top: 95,
  left: left,
  zIndex: zIndex,
  backgroundColor: NAVY,
  color: "white",
  padding: "12px 8px",
  minWidth: width,
  borderBottom: `2px solid ${GOLD}`
});

const gameHeaderStyle = {
  position: "sticky",
  top: 95,
  backgroundColor: NAVY,
  color: "white",
  padding: "8px 4px",
  minWidth: 80,
  textAlign: "center",
  borderBottom: `2px solid ${GOLD}`,
  borderLeft: "1px solid rgba(255,255,255,0.1)"
};

const stickyColumnStyle = {
  position: "sticky",
  left: 0,
  backgroundColor: "white",
  zIndex: 5,
  padding: "10px 8px",
  borderRight: `2px solid ${GOLD}`,
  whiteSpace: "nowrap"
};

const cellStyle = {
  padding: "8px 4px",
  textAlign: "center",
  borderLeft: "1px solid #f0f0f0"
};