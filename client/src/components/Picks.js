import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import toast, { Toaster } from "react-hot-toast";
import Instructions from "./Instructions";

/* ---------- HELPERS ---------- */
const isLocked = iso => iso && new Date() >= new Date(iso);

export default function Picks() {
  const [name, setUser] = useState("SELECT YOUR NAME IN DROPDOWN!");
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [picks, setPicks] = useState([]);
  const [allDogs, setAllDogs] = useState(false);
  const [allFaves, setAllFaves] = useState(false);

  useEffect(() => {
    axios.get("/api/games").then(res => setGames(res.data));
    axios.get("/api/users").then(res =>
      setUsers(res.data.sort((a, b) => a.name.localeCompare(b.name)))
    );
  }, []);
  console.log(games)
  const visibleGames = useMemo(
    () =>
      games
        .filter(g => !isLocked(g.game_date))
        .sort((a, b) => new Date(a.game_date) - new Date(b.game_date)),
    [games]
  );

  function formatDateET(date) {
    return new Date(date).toLocaleDateString("en-US", {
      timeZone: "America/New_York",
      month: "short",
      day: "numeric"
    });
  }

  function formatTimeET(date) {
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
    const validGames = visibleGames;

    setPicks(
      validGames.map(g => ({
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
    if (name === "SELECT YOUR NAME IN DROPDOWN!") {
      toast.error("Please select your name");
      return;
    }

    try {
      for (const p of picks) {
        await axios.post("/api/picks", {
          name,
          game_id: p.game,
          pick: p.pick,
          game_date: p.game_date
        });
      }

      toast.success(`Thanks ${name}, picks submitted!`);
      setPicks([]);
    } catch {
      toast.error("Submission failed");
    }
  };

  return (
    <div className="container">
      <Toaster />
      <Instructions />

      <DropdownButton title="User" onSelect={setUser}>
        {users.map(n => (
          <Dropdown.Item key={n.name} eventKey={n.name}>
            {n.name}
          </Dropdown.Item>
        ))}
      </DropdownButton>

      <h4>User: {name}</h4>
      <Button onClick={handleSubmit}>Submit Picks</Button>{' '}

      <label>
        <input
          type="checkbox"
          checked={allDogs}
          onChange={() => selectAll("dogs")}
        /> Select All Underdogs
      </label>{' '}

      <label>
        <input
          type="checkbox"
          checked={allFaves}
          onChange={() => selectAll("faves")}
        /> Select All Favorites
      </label>
      <h5>
        Picks selected: {picks.length} / {visibleGames.length}
      </h5>

      <Table striped bordered hover>
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
                <img src={game.dog_logo} width={24} /> {game.underdog}
                {" vs "}
                <img src={game.fav_logo} width={24} /> {game.favorite}
              </td>
              <td>
                {formatTimeET(game.line_locked_time)} ET
              </td>
              <td>
                {new Date() >= new Date(game.line_locked_time) ? (
                  <span style={{ fontWeight: 'bold', color: '#d9534f' }}>
                    🔒 -{game.line}
                  </span>
                ) : (
                  game.line ? `-${game.line}` : "TBD"
                )}
              </td>

              <td>

                <select
                  // Add a required attribute for standard HTML validation
                  required
                  value={picks.find(p => p.game === game.id)?.pick || ""}
                  onChange={e => updatePick(game, e.target.value)}
                >
                  {/* This is the key: hidden hides it from the list, 
      disabled prevents it from being selected again */}
                  <option value="" disabled hidden>Select a team</option>

                  <option value={game.underdog}>
                    {game.underdog} (+{game.line})
                  </option>
                  <option value={game.favorite}>
                    {game.favorite} (-{game.line})
                  </option>
                </select>
                {/* <select
                  value={picks.find(p => p.game === game.id)?.pick || ""}
                  onChange={e => updatePick(game, e.target.value)}
                >
                  <option value="" />
                  <option value={game.underdog}>
                    {game.underdog} (+{game.line})
                  </option>
                  <option value={game.favorite}>
                    {game.favorite} (-{game.line})
                  </option>
                </select> */}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

    </div>
  );
}