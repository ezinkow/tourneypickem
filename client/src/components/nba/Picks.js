import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import Instructions from "./Instructions";

const isLocked = iso => iso && new Date() >= new Date(iso);
const GOLD = "#c89d3c";
const NAVY = "#13447a";
const LENGTHS = [4, 5, 6, 7];

const thStyle = { padding: "12px 15px", textAlign: "left", fontSize: 13, fontWeight: 600 };
const tdStyle = { padding: "12px 15px" };
const cardStyle = { background: "white", padding: 16, borderRadius: 10, marginBottom: 12, boxShadow: "0 2px 5px rgba(0,0,0,0.05)" };
const mobileBtnStyle = (active) => ({ flex: 1, padding: 10, borderRadius: 8, border: active ? `2px solid ${NAVY}` : "1px solid #ddd", background: active ? "#eff6ff" : "white", cursor: "pointer" });
const lenBtnStyle = (active) => ({ width: 30, height: 30, borderRadius: 4, background: active ? NAVY : "white", color: active ? "white" : "#333", border: "1px solid #ddd", cursor: "pointer" });

export default function Picks() {
  const { user: authUser, login, logout, loading: authLoading } = useAuth();
  const [games, setGames] = useState([]);
  const [picks, setPicks] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [tiebreakerWin, setTiebreakerWin] = useState("");
  const [tiebreakerLoss, setTiebreakerLoss] = useState("");

  // 1. Initial Load: Series Data
  useEffect(() => {
    axios.get("/api/nba/series")
      .then(res => setGames(res.data || []))
      .catch(err => toast.error("Error loading games"));
  }, []);

  // 2. Load User Data: Picks & Tiebreaker
  useEffect(() => {
    if (authUser && games.length > 0) {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      axios.get("/api/nba/picks", { params: { name: authUser.name }, ...config })
        .then(res => {
          if (res.data && Array.isArray(res.data)) {
            const mappedPicks = res.data.map(p => ({
              game: String(p.series_id),
              pick: p.pick,
              confidence: parseInt(p.confidence) || 0,
              length: parseInt(p.series_length_guess) || 4
            }));
            setPicks(mappedPicks);
          }
          setDataLoaded(true);
        })
        .catch(() => {
          setDataLoaded(true);
        });

      axios.get("/api/nba/tiebreaker", { params: { name: authUser.name }, ...config })
        .then(res => {
          if (res.data) {
            setTiebreakerWin(res.data.win_score || "");
            setTiebreakerLoss(res.data.loss_score || "");
          }
        }).catch(() => { });
    }
  }, [authUser, games]);

  // Only show Decided Matchups that aren't locked
  const visibleGames = useMemo(() =>
    games.filter(g => !isLocked(g.game_date) && g.home_team !== "TBD" && g.away_team !== "TBD")
      .sort((a, b) => new Date(a.game_date) - new Date(b.game_date)),
    [games]
  );

  const roundMax = useMemo(() => visibleGames[0]?.round_points_max || 32, [visibleGames]);

  const currentPointsUsed = useMemo(() =>
    picks.reduce((sum, p) => sum + (parseInt(p.confidence) || 0), 0),
    [picks]
  );

  const updatePickData = (gameId, field, value) => {
    const sId = String(gameId);
    setPicks(prev => {
      const existing = prev.find(p => p.game === sId);
      if (existing) {
        if (field === 'pick' && existing.pick === value) return prev.filter(p => p.game !== sId);
        return prev.map(p => p.game === sId ? { ...p, [field]: value } : p);
      }
      return [...prev, {
        game: sId,
        pick: field === 'pick' ? value : null,
        confidence: field === 'confidence' ? value : 0,
        length: field === 'length' ? value : 4
      }];
    });
  };

  const handleSubmitPicks = async () => {
    if (picks.length === 0) return toast.error("No picks selected");
    if (currentPointsUsed > roundMax) return toast.error(`Over the ${roundMax} point limit!`);

    const token = localStorage.getItem("token");
    try {
      await axios.post("/api/nba/picks/bulk", {
        name: authUser.name,
        picks: picks.map(p => ({
          series_id: p.game,
          pick: p.pick,
          confidence: p.confidence,
          series_length_guess: p.length
        }))
      }, { headers: { Authorization: `Bearer ${token}` } });

      toast.success("Picks submitted!");
      setTimeout(() => { window.location.hash = "#/nba/mypicks"; }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save picks");
    }
  };

  if (authLoading) return <div style={{ paddingTop: 100, textAlign: "center" }}>Verifying Session...</div>;
  if (!authUser) return <div style={{ paddingTop: 100, textAlign: "center" }}>Please log in to make picks.</div>;
  if (!dataLoaded && games.length > 0) return <div style={{ paddingTop: 100, textAlign: "center" }}>Loading your saved picks...</div>;

  return (
    <div style={{ paddingTop: 68, paddingBottom: 80, maxWidth: 1200, margin: "0 auto", paddingLeft: 12, paddingRight: 12 }}>
      <Toaster />
      <Instructions />

      <div style={{ position: "sticky", top: 70, zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, background: "#fff", padding: "15px", borderRadius: "10px", border: `2px solid ${GOLD}`, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
        <div>
          <h4 style={{ margin: 0 }}>{authUser.name} - {visibleGames[0]?.round_label || "Round 1"}</h4>
          <div style={{ fontSize: "14px", marginTop: "4px" }}>
            Points: <span style={{ fontWeight: 700, color: currentPointsUsed > roundMax ? "red" : "#16a34a" }}>{currentPointsUsed}</span> / {roundMax}
          </div>
        </div>
        <button onClick={handleSubmitPicks} style={{ padding: "12px 28px", borderRadius: 8, backgroundColor: "#16a34a", color: "white", border: "none", fontWeight: 700, cursor: "pointer" }}>Submit All Picks</button>
      </div>

      <div className="desktop-only" style={{ background: "white", borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: NAVY, color: "white" }}>
            <tr>
              <th style={thStyle}>Matchup</th>
              <th style={thStyle}>Winner</th>
              <th style={thStyle}>Series Length</th>
              <th style={thStyle}>Confidence (1-10)</th>
            </tr>
          </thead>
          <tbody>
            {visibleGames.map(game => {
              const currentPick = picks.find(p => p.game === String(game.id));
              return (
                <tr key={game.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={tdStyle}>
                    <div style={{ fontSize: 11, color: "#666" }}>Series Start: {new Date(game.game_date).toLocaleDateString()}</div>
                    <div style={{ fontWeight: 600 }}>{game.away_team} @ {game.home_team}</div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[game.away_team, game.home_team].map(team => (
                        <button
                          key={team}
                          onClick={() => updatePickData(game.id, 'pick', team)}
                          style={{
                            padding: "6px 12px", borderRadius: 6, border: currentPick?.pick === team ? `2px solid ${NAVY}` : "1px solid #ddd",
                            backgroundColor: currentPick?.pick === team ? "#eff6ff" : "white", cursor: "pointer", display: "flex", alignItems: "center", gap: 6
                          }}
                        >
                          <img src={team === game.home_team ? game.home_logo : game.away_logo} width={20} alt="" />
                          <span style={{ fontSize: 12 }}>{team}</span>
                        </button>
                      ))}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {LENGTHS.map(len => (
                        <button
                          key={len}
                          onClick={() => updatePickData(game.id, 'length', len)}
                          style={{
                            width: 32, height: 32, borderRadius: 6, border: "1px solid #ddd",
                            backgroundColor: currentPick?.length === len ? NAVY : "white",
                            color: currentPick?.length === len ? "white" : "#333", cursor: "pointer"
                          }}
                        >
                          {len}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <select
                      value={currentPick?.confidence || ""}
                      onChange={(e) => updatePickData(game.id, 'confidence', parseInt(e.target.value))}
                      style={{ padding: "8px", borderRadius: 6, border: "1px solid #ddd", width: "100%" }}
                    >
                      <option value="" disabled>Pts</option>
                      {[...Array(10)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mobile-only">
        {visibleGames.map(game => {
          const currentPick = picks.find(p => p.game === String(game.id));
          return (
            <div key={game.id} style={cardStyle}>
              <div style={{ fontWeight: 700, marginBottom: 10 }}>{game.away_team} vs {game.home_team}</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <button onClick={() => updatePickData(game.id, 'pick', game.away_team)} style={mobileBtnStyle(currentPick?.pick === game.away_team)}>
                  <img src={game.away_logo} width={24} height={24} alt="" /> {game.away_team}
                </button>
                <button onClick={() => updatePickData(game.id, 'pick', game.home_team)} style={mobileBtnStyle(currentPick?.pick === game.home_team)}>
                  <img src={game.home_logo} width={24} height={24} alt="" /> {game.home_team}
                </button>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <select value={currentPick?.confidence || ""} onChange={(e) => updatePickData(game.id, 'confidence', parseInt(e.target.value))} style={{ padding: 8, borderRadius: 6 }}>
                  <option value="" disabled>Confidence</option>
                  {[...Array(10)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                </select>
                <div style={{ display: "flex", gap: 4 }}>
                  {LENGTHS.map(len => (
                    <button key={len} onClick={() => updatePickData(game.id, 'length', len)} style={lenBtnStyle(currentPick?.length === len)}>{len}</button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .desktop-only { display: block; }
        .mobile-only { display: none; }
        @media (max-width: 768px) {
          .desktop-only { display: none; }
          .mobile-only { display: block; }
        }
      `}</style>
    </div>
  );
}