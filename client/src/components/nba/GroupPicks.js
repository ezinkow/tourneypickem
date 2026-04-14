
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import NbaGatekeeper from "../../components/nba/NbaGatekeeper";

// NBA Colors
const NAVY = "#0a1628";
const GOLD = "#c89d3c";
const RED = "#c8102e";

export default function GroupPicks() {
  const [series,      setSeries]      = useState([]);
  const [picks,       setPicks]       = useState([]);
  const [standings,   setStandings]   = useState([]);
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

        // Show all series that have both teams set (known matchups)
        // Pre-playoffs: show all Round 1 series even if not yet locked
        setSeries(
          seriesRes.data
            .filter(s => s.home_team && s.away_team)
            .sort((a, b) => a.round - b.round || a.series_slot - b.series_slot)
        );
        setPicks(picksRes.data);
        setStandings(standingsRes.data.sort((a, b) => b.points - a.points));
        setTiebreakers(tbRes.data);
      } catch (err) {
        console.error("Matrix load failed", err);
      }
    };

    fetchAll();
    const interval = setInterval(fetchAll, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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
    if (!pick || s.status !== "STATUS_FINAL") return {};
    const correctWinner = pick.pick === s.winner;
    if (correctWinner) {
      return pick.series_length_guess === s.series_length
        ? { backgroundColor: "#fef9c3", borderBottom: `2px solid ${GOLD}` }
        : { backgroundColor: "#dcfce7" };
    }
    return { backgroundColor: "#fee2e2" };
  };

  const PLAYER_COL_W = 130;
  const SERIES_COL_W = 86;

  return (
    <NbaGatekeeper user={user}>
      <div className="page-content" style={{ paddingBottom: 80 }}>

        {/* Legend bar */}
        <div style={{
          display: "flex", gap: 16, alignItems: "center",
          padding: "10px 16px", background: "#f8f9fa",
          borderBottom: `2px solid ${GOLD}`, marginBottom: 0,
          flexWrap: "wrap",
        }}>
          <h4 style={{ margin: 0, fontSize: 15, color: NAVY }}>Group Picks</h4>
          <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#374151" }}>
            <span><span style={{ color: "#22c55e" }}>●</span> Correct</span>
            <span><span style={{ color: "#eab308" }}>●</span> Perfect (×2)</span>
            <span><span style={{ color: "#ef4444" }}>●</span> Wrong</span>
            <span style={{ color: "#9ca3af" }}>— Not yet revealed</span>
          </div>
        </div>

        {/* Scrollable table wrapper */}
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{
            borderCollapse: "collapse",
            backgroundColor: "white",
            tableLayout: "fixed",
            width: PLAYER_COL_W + series.length * SERIES_COL_W,
            minWidth: "100%",
          }}>
            <thead>
              <tr>
                {/* Player sticky corner */}
                <th style={{
                  position: "sticky", left: 0, top: 0, zIndex: 6,
                  backgroundColor: NAVY, color: "white",
                  padding: "10px 8px", width: PLAYER_COL_W,
                  minWidth: PLAYER_COL_W, borderBottom: `2px solid ${GOLD}`,
                  textAlign: "left", fontSize: 12,
                }}>
                  Player
                </th>

                {/* Series headers */}
                {series.map(s => (
                  <th key={s.id} style={{
                    backgroundColor: NAVY, color: "white",
                    padding: "6px 4px", width: SERIES_COL_W,
                    minWidth: SERIES_COL_W, textAlign: "center",
                    borderBottom: `2px solid ${GOLD}`,
                    borderLeft: "1px solid rgba(255,255,255,0.1)",
                    fontSize: 10, verticalAlign: "bottom",
                  }}>
                    <div style={{ marginBottom: 3, color: GOLD, fontSize: 9, textTransform: "uppercase" }}>
                      {s.round_label?.replace("Conference ", "Conf ") || `R${s.round}`}
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 3 }}>
                      {s.away_logo && <img src={s.away_logo} height={16} alt={s.away_team} title={s.away_team} />}
                      <span style={{ fontSize: 9, color: "#9ca3af" }}>vs</span>
                      {s.home_logo && <img src={s.home_logo} height={16} alt={s.home_team} title={s.home_team} />}
                    </div>
                    {s.status === "STATUS_FINAL" && (
                      <div style={{ fontSize: 9, color: GOLD, marginTop: 2 }}>
                        {s.away_wins}–{s.home_wins}
                      </div>
                    )}
                    {s.status === "STATUS_IN_PROGRESS" && (
                      <div style={{ fontSize: 9, color: "#22c55e", marginTop: 2 }}>
                        {s.away_wins}–{s.home_wins} 🔴
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {standings.map((standing, idx) => (
                <tr key={standing.entry_name} style={{ borderBottom: "1px solid #f0f0f0" }}>

                  {/* Player name sticky column */}
                  <td style={{
                    position: "sticky", left: 0, zIndex: 2,
                    backgroundColor: "white", padding: "8px 10px",
                    borderRight: `2px solid ${GOLD}`, whiteSpace: "nowrap",
                    width: PLAYER_COL_W, minWidth: PLAYER_COL_W,
                  }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: NAVY }}>
                      {idx + 1}. {standing.entry_name}
                    </div>
                    <div style={{ fontSize: 11, color: "#6b7280" }}>
                      {standing.points} pts
                    </div>
                  </td>

                  {/* Pick cells */}
                  {series.map(s => {
                    const p = pickMap[s.id]?.[standing.entry_name];
                    const cellBg = getCellStyle(s, p);
                    return (
                      <td key={s.id} style={{
                        padding: "6px 4px", textAlign: "center",
                        borderLeft: "1px solid #f0f0f0",
                        width: SERIES_COL_W, minWidth: SERIES_COL_W,
                        verticalAlign: "middle", ...cellBg,
                      }}>
                        {p ? (
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                            {/* Team logo */}
                            {(p.pick === s.home_team ? s.home_logo : s.away_logo) && (
                              <img
                                src={p.pick === s.home_team ? s.home_logo : s.away_logo}
                                height={20}
                                alt={p.pick}
                                title={p.pick}
                              />
                            )}
                            {/* Confidence */}
                            <div style={{ fontSize: 10, fontWeight: 700, color: NAVY }}>
                              {p.confidence}
                            </div>
                            {/* Series length guess */}
                            {p.series_length_guess && (
                              <div style={{ fontSize: 9, color: "#9ca3af" }}>
                                in {p.series_length_guess}
                              </div>
                            )}
                          </div>
                        ) : (
                          // Unlocked series — hide other users' picks
                          <span style={{ color: "#d1d5db", fontSize: 14 }}>—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {standings.length === 0 && (
                <tr>
                  <td
                    colSpan={series.length + 1}
                    style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}
                  >
                    No entries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </NbaGatekeeper>
  );
}