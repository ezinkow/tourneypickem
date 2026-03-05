import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Instructions from "./Instructions";

/* ---------- HELPERS ---------- */
const isLocked = iso => iso && new Date() >= new Date(iso);

export default function Picks() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState("SELECT YOUR NAME");
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const [games, setGames] = useState([]);
  const [picks, setPicks] = useState([]);
  const [allDogs, setAllDogs] = useState(false);
  const [allFaves, setAllFaves] = useState(false);

  /* ---------- Initial Load ---------- */
  useEffect(() => {
    axios.get("/api/games").then(res => setGames(res.data));
    axios.get("/api/users").then(res =>
      setUsers(res.data.sort((a, b) => a.name.localeCompare(b.name)))
    );
  }, []);

  useEffect(() => {
    document.body.classList.add("force-mobile");
    return () => document.body.classList.remove("force-mobile");
  }, []);

  /* ---------- Authentication Logic ---------- */
  const verify = async () => {
    try {
      const res = await axios.post("/api/users/verify", { name: user, password });
      if (!res.data.success) return toast.error("Wrong password");

      setAuthenticated(true);
      toast.success("Identity verified!");
    } catch {
      toast.error("Verify failed");
    }
  };

  const visibleGames = useMemo(
    () =>
      games
        .filter(g => !isLocked(g.game_date))
        .sort((a, b) => new Date(a.game_date) - new Date(b.game_date)),
    [games]
  );

  function formatTimeET(date) {
    if (!date) return "TBD";
    return new Date(date).toLocaleTimeString("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const updatePick = (game, pick) => {
    setPicks(prev => {
      const existing = prev.find(p => p.game === game.id);
      if (existing) {
        return prev.map(p =>
          p.game === game.id ? { ...p, pick } : p
        );
      }
      return [
        ...prev,
        {
          game: game.id,
          pick,
          line: game.line,
          game_date: game.game_date
        }
      ];
    });
  };

  const selectAll = type => {
    const isCurrentlySelected = type === "dogs" ? allDogs : allFaves;

    if (isCurrentlySelected) {
      // Uncheck — clear all picks
      setPicks([]);
      setAllDogs(false);
      setAllFaves(false);
    } else {
      // Check — select all
      setPicks(
        visibleGames.map(g => ({
          game: g.id,
          pick: type === "dogs" ? g.underdog : g.favorite,
          line: g.line,
          game_date: g.game_date
        }))
      );
      setAllDogs(type === "dogs");
      setAllFaves(type === "faves");
    }
  };

  const handleSubmit = async () => {
    if (picks.length === 0) return toast.error("No picks selected");

    try {
      // Format picks to match the backend expectation
      const payload = {
        name: user,
        picks: picks.map(p => ({
          game_id: p.game,
          pick: p.pick,
          game_date: p.game_date
        }))
      };

      // Single request instead of a loop
      await axios.post("/api/picks/bulk", payload);

      toast.success(`Thanks ${user}, ${picks.length} picks submitted!`);
      setPicks([]); // Clear local state after success
    } catch (err) {
      console.error(err);
      toast.error("Submission failed");
    }
  };

  return (
    <div style={{ paddingTop: 68, paddingBottom: 80, maxWidth: 1200, margin: "0 auto" }}>
      <Toaster />
      <div style={{ padding: "0 12px" }}>
        <Instructions />
        <h2 style={{ color: "var(--primary-navy)", marginBottom: 12 }}>🏀 Make Your Picks 🗑️</h2>

        {!authenticated && (
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
            <select
              value={user}
              onChange={e => setUser(e.target.value)}
              style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc", fontSize: 14, minWidth: 160 }}
            >
              <option value="SELECT YOUR NAME" disabled>SELECT YOUR NAME</option>
              {users.map(n => (
                <option key={n.name} value={n.name}>{n.name}</option>
              ))}
            </select>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              onKeyDown={e => e.key === "Enter" && verify()}
              style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc", fontSize: 14, minWidth: 140 }}
            />
            <button
              onClick={verify}
              style={{ padding: "8px 16px", borderRadius: 6, backgroundColor: "#13447a", color: "white", border: "none", fontWeight: 600, cursor: "pointer" }}
            >
              Verify Identity
            </button>
          </div>
        )}

        {authenticated && (
          <>
            <h4>User: {user}</h4>
            <div style={{ marginBottom: 15, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <button
                onClick={handleSubmit}
                style={{ padding: "8px 18px", borderRadius: 6, backgroundColor: "#16a34a", color: "white", border: "none", fontWeight: 600, cursor: "pointer" }}
              >
                Submit Picks
              </button>
              <button
                type="button"
                onClick={() => selectAll("dogs")}
                style={{
                  padding: "6px 14px", borderRadius: 6, fontSize: 13, cursor: "pointer", fontWeight: 600,
                  backgroundColor: allDogs ? "#eff6ff" : "#f3f4f6",
                  border: allDogs ? "2px solid #13447a" : "1px solid #d1d5db",
                  color: allDogs ? "#13447a" : "#374151",
                }}
              >
                All Underdogs
              </button>
              <button
                type="button"
                onClick={() => selectAll("faves")}
                style={{
                  padding: "6px 14px", borderRadius: 6, fontSize: 13, cursor: "pointer", fontWeight: 600,
                  backgroundColor: allFaves ? "#eff6ff" : "#f3f4f6",
                  border: allFaves ? "2px solid #13447a" : "1px solid #d1d5db",
                  color: allFaves ? "#13447a" : "#374151",
                }}
              >
                All Favorites
              </button>
              <button
                type="button"
                onClick={() => { setPicks([]); setAllDogs(false); setAllFaves(false); }}
                style={{ padding: "6px 14px", borderRadius: 6, backgroundColor: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db", fontWeight: 600, cursor: "pointer", fontSize: 13 }}
              >
                Clear All
              </button>
            </div>
          </>
        )}
      </div>

      {authenticated && (
        <table style={{ borderCollapse: "collapse", width: "100%", background: "white", fontSize: 14, marginTop: 8 }}>
          <thead>
            <tr>
              {["Game Start", "Game", "Line Locks", "Line", "Pick"].map(h => (
                <th key={h} style={{
                  position: "sticky",
                  top: 65,
                  zIndex: 4,
                  padding: "10px 12px",
                  backgroundColor: "#13447a",
                  color: "white",
                  borderBottom: "2px solid #c89d3c",
                  textAlign: "left",
                  whiteSpace: "nowrap",
                  textTransform: "uppercase",
                  fontSize: 11,
                  letterSpacing: "0.3px",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleGames.map((game, idx) => (
              <tr key={game.id} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#f9fafb" }}>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap" }}>{game.game_clock}</td>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap" }}>
                  <img src={game.away_logo} width={24} alt="" /> {game.away_team}
                  {" @ "}
                  <img src={game.home_logo} width={24} alt="" /> {game.home_team}
                </td>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap" }}>
                  {formatTimeET(game.line_locked_time)} ET
                </td>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap" }}>
                  {new Date() >= new Date(game.line_locked_time) ? (
                    <span style={{ fontWeight: "bold", color: "#d9534f" }}>
                      🔒 <img src={game.fav_logo} width={24} alt="fav" /> -{game.line}
                    </span>
                  ) : game.line ? (
                    <><img src={game.fav_logo} width={24} alt="fav" /> -{game.line}</>
                  ) : "TBD"}
                </td>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #e5e7eb" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                      { value: game.underdog, logo: game.dog_logo, label: `${game.underdog}`, spread: `+${game.line}` },
                      { value: game.favorite, logo: game.fav_logo, label: `${game.favorite}`, spread: `-${game.line}` },
                    ].map(({ value, logo, label, spread }) => {
                      const selected = picks.find(p => p.game === game.id)?.pick === value;
                      return (
                        <button
                          key={value}
                          onClick={() => updatePick(game, value)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "5px 10px",
                            borderRadius: 6,
                            border: selected ? "2px solid #13447a" : "1px solid #d1d5db",
                            backgroundColor: selected ? "#eff6ff" : "white",
                            cursor: "pointer",
                            fontSize: 13,
                            fontWeight: selected ? 700 : 400,
                            color: selected ? "#13447a" : "#374151",
                            width: "100%",
                            textAlign: "left",
                          }}
                        >
                          {logo && <img src={logo} width={20} height={20} alt="" style={{ objectFit: "contain", flexShrink: 0 }} />}
                          <span>{label}</span>
                          <span style={{ marginLeft: "auto", color: "#6b7280", fontSize: 12 }}>{spread}</span>
                        </button>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}