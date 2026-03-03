import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function PlayerPicksMatrix() {
  const [games, setGames] = useState([]);
  const [picks, setPicks] = useState([]);
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    axios.get("/api/games/finishedAndInProgress").then(r =>
      setGames(
        r.data
          .filter(g => g.status === "STATUS_FINAL" || g.status === "STATUS_IN_PROGRESS")
          .sort((a, b) => new Date(a.game_date) - new Date(b.game_date))
      )
    );
    axios.get("/api/picks").then(r => setPicks(r.data));
    axios.get("/api/standings").then(r => setStandings(r.data));
  }, []);

  const users = useMemo(() =>
    [...standings].sort((a, b) => b.points - a.points),
    [standings]);

  const pickMap = useMemo(() => {
    const map = {};
    for (const p of picks) {
      if (!map[p.game_id]) map[p.game_id] = {};
      map[p.game_id][p.name] = p;
    }
    return map;
  }, [picks]);

  /* ---------------- CELL COLOR ---------------- */
  // FIX: use game.winner instead of game.covered
  const getCellStyle = (game, pickObj) => {
    console.log(game)
    if (!pickObj) return {};
    if (!game.winner) return {};
    const correct = pickObj.pick === game.winner;
    if (correct && pickObj.missed_pick_flag) return { backgroundColor: "#ccf88556" };
    if (correct) return { backgroundColor: "#41ac618e" };
    return { backgroundColor: "#d646464b" };
  };

  /* ---------------- PICK LOGO ---------------- */
  const PickLogo = ({ game, pickObj }) => {
    if (!pickObj) return <span style={{ color: "#9ca3af" }}>–</span>;
    const logo = pickObj.pick === game.favorite ? game.fav_logo
      : pickObj.pick === game.underdog ? game.dog_logo
        : null;
    if (!logo) return <span style={{ fontSize: 11 }}>{pickObj.pick}</span>;
    return (
      <img
        src={logo}
        alt={pickObj.pick}
        title={pickObj.pick}
        style={{ height: 22, width: 22, objectFit: "contain", display: "block", margin: "auto" }}
      />
    );
  };

  const legend = <div style={{
    display: "flex",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
    fontSize: 12,
    color: "#6b7280",
    padding: "8px 12px",
    marginBottom: 8,
  }}>
    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#41ac618e", display: "inline-block" }} />
      Correct pick
    </span>
    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ccf88556", display: "inline-block" }} />
      Correct missed pick (0.5 pt)
    </span>
    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#d646464b", display: "inline-block" }} />
      Missed pick
    </span>
  </div>

  /* ---------------- HEADER GAME CELL ---------------- */
  const GameHeader = ({ game }) => {
    const isHomeFav = game.home_team === game.favorite;
    const winnerLogo = game.winner === game.favorite ? game.fav_logo
      : game.winner === game.underdog ? game.dog_logo
        : null;

    return (
      <div style={{ textAlign: "center", width: "100%", overflow: "hidden", backgroundColor: "rgba(255,255,255,0.15)" }}>

        {/* Row 1: away logo @ home logo */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
          borderRadius: 5,
          padding: "3px 4px",
        }}>
          <img src={game.away_logo} alt="" height={18} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 9, color: "#cbd5e1" }}>@</span>
          <img src={game.home_logo} alt="" height={18} style={{ flexShrink: 0 }} />
        </div>

        {/* Row 2: score */}
        <div style={{
          fontSize: 10,
          fontWeight: 700,
          color: "#ffffff",
          whiteSpace: "nowrap",
          marginTop: 2,
        }}>
          {game.status === "STATUS_FINAL" || game.status === "STATUS_IN_PROGRESS"
            ? `${game.away_score}-${game.home_score}`
            : ""}
        </div>

        {/* Row 3: covered team logo + spread result */}
        <div style={{ marginTop: 2, display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
          {winnerLogo ? (() => {
            const coveredIsFav = game.winner === game.favorite;
            const spreadLabel = coveredIsFav ? `-${game.line}` : `+${game.line}`;
            return (
              <>
                <img src={winnerLogo} alt="" height={13} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 8, color: coveredIsFav ? "#86efac" : "#fca5a5", fontWeight: 700 }}>
                  {spreadLabel}
                </span>
              </>
            );
          })() : (
            <span style={{ fontSize: 8, color: "#93c5fd" }}>
              {game.status === "STATUS_IN_PROGRESS" ? "🔴" : "–"}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="picks-matrix-container">
      <h3 style={{ padding: "0 12px 8px", color: "var(--primary-navy)" }}>Group Picks</h3>
      <span>{legend}</span>
      <div className="picks-matrix-scroll">
        <table className="picks-matrix-table">
          <thead>
            <tr>
              <th className="picks-sticky-col picks-sticky-header">Player</th>
              {games.map(g => (
                <th key={g.id} className="picks-game-header">
                  <GameHeader game={g} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.name}>
                <td className="picks-sticky-col picks-player-cell">
                  <span className="picks-rank">
                    {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}.`}
                  </span>
                  <span className="picks-player-name">{user.name}</span>
                  <span className="picks-points">({user.points})</span>
                </td>
                {games.map(game => {
                  const pickObj = pickMap?.[game.id]?.[user.name];
                  return (
                    <td
                      key={user.name + game.id}
                      className="picks-pick-cell"
                      style={getCellStyle(game, pickObj)}
                    >
                      <PickLogo game={game} pickObj={pickObj} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}