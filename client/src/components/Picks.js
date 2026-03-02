import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
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
  };

  const handleSubmit = async () => {
    try {
      for (const p of picks) {
        await axios.post("/api/picks", {
          name: user, // Using 'user' from state
          game_id: p.game,
          pick: p.pick,
          game_date: p.game_date
        });
      }
      toast.success(`Thanks ${user}, picks submitted!`);
      setPicks([]);
    } catch {
      toast.error("Submission failed");
    }
  };

  return (
    <div className="container">
      <Toaster />
      <Instructions />

      <h2>🏀 Make Your Picks 🗑️</h2>

      {/* --- Auth Section --- */}
      {!authenticated && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            verify();
          }}
          className="auth-container" /* Use this class instead of inline flex */
        >
          <Dropdown onSelect={setUser} className="user-dropdown">
            <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
              {user}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {users.map(n => (
                <Dropdown.Item key={n.name} eventKey={n.name}>
                  {n.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <input
            type="password"
            className="form-control auth-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          <Button type="submit" variant="primary">Verify Identity</Button>
        </form>
      )}

      {/* --- Picks Section --- */}
      {authenticated && (
        <>
          <h4>User: {user}</h4>
          <div style={{ marginBottom: 15 }}>
            <Button onClick={handleSubmit} variant="success">Submit Picks</Button>{' '}
            <label style={{ marginLeft: 10 }}>
              <input
                type="checkbox"
                checked={allDogs}
                onChange={() => selectAll("dogs")}
              /> Select All Underdogs
            </label>{' '}
            <label style={{ marginLeft: 10 }}>
              <input
                type="checkbox"
                checked={allFaves}
                onChange={() => selectAll("faves")}
              /> Select All Favorites
            </label>
          </div>

          <h5>
            Picks selected: {picks.length} / {visibleGames.length}
          </h5>

          <Table striped bordered hover responsive className="table-wrapper">
            <thead>
              <tr>
                <th>Game Start</th>
                <th>Game</th>
                <th>Line Locks at</th>
                <th>Line</th>
                <th>Pick</th>
              </tr>
            </thead>
            <tbody>
              {visibleGames.map(game => (
                <tr key={game.id}>
                  <td>{game.game_clock}</td>
                  <td>
                    <img src={game.away_logo} width={24} alt="" /> {game.away_team}
                    {" @ "}
                    <img src={game.home_logo} width={24} alt="" /> {game.home_team}
                  </td>
                  <td>
                    {formatTimeET(game.line_locked_time)} ET
                  </td>
                  <td>
                    {new Date() >= new Date(game.line_locked_time) ? (
                      <span style={{ fontWeight: 'bold', color: '#d9534f' }}>
                        🔒 <img src={game.fav_logo} width={24} alt="fav" /> -{game.line}
                      </span>
                    ) : (
                      game.line ? (
                        <>
                          <img src={game.fav_logo} width={24} alt="fav" /> -{game.line}
                        </>
                      ) : (
                        "TBD"
                      )
                    )}
                  </td>
                  <td>
                    <select
                      className="form-select"
                      required
                      value={picks.find(p => p.game === game.id)?.pick || ""}
                      onChange={e => updatePick(game, e.target.value)}
                    >
                      <option value="" disabled hidden>Select a team</option>
                      <option value={game.underdog}>
                        {game.underdog} (+{game.line})
                      </option>
                      <option value={game.favorite}>
                        {game.favorite} (-{game.line})
                      </option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
}