import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";

export default function PlayerPicksMatrix() {
  const [games, setGames] = useState([]);
  const [picks, setPicks] = useState([]);
  const [standings, setStandings] = useState([]);

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    axios.get("/api/games/finishedAndInProgress").then(r =>
      setGames(
        r.data
          .filter(
            g =>
              g.status === "STATUS_FINAL" ||
              g.status === "STATUS_IN_PROGRESS"
          )
          .sort((a, b) => new Date(a.game_date) - new Date(b.game_date))
      )
    );

    axios.get("/api/picks").then(r => setPicks(r.data));
    axios.get("/api/standings").then(r => setStandings(r.data));
  }, []);

  /* ---------------- USERS ORDERED BY POINTS ---------------- */
  const users = useMemo(() => {
    return [...standings].sort((a, b) => b.points - a.points);
  }, [standings]);

  /* ---------------- FAST LOOKUP MAP ---------------- */
  const pickMap = useMemo(() => {
    const map = {};
    for (const p of picks) {
      if (!map[p.game_id]) map[p.game_id] = {};
      map[p.game_id][p.name] = p;
    }
    return map;
  }, [picks]);

  /* ---------------- CELL COLOR ---------------- */
  const getCellStyle = (game, pickObj) => {
    if (!pickObj) return {};

    if (!game.covered) return {}; // not final

    const correct = pickObj.pick === game.covered;

    if (correct && pickObj.missed_pick_flag)
      return { backgroundColor: "#fff3cd" }; // yellow

    if (correct)
      return { color: "green", fontWeight: "bold" };

    return { color: "red" };
  };

  /* ---------------- PICK LOGO ---------------- */
  const PickLogo = ({ game, pickObj }) => {
    if (!pickObj) return <span>-</span>;

    let logo = null;
    let alt = pickObj.pick;

    if (pickObj.pick === game.favorite)
      logo = game.fav_logo;
    else if (pickObj.pick === game.underdog)
      logo = game.dog_logo;

    if (!logo) return <span>{pickObj.pick}</span>;

    return (
      <img
        src={logo}
        alt={alt}
        style={{
          height: 24,
          width: 24,
          objectFit: "contain",
          display: "block",
          margin: "auto"
        }}
      />
    );
  };

  /* ---------------- HEADER GAME CELL ---------------- */
  const GameHeader = ({ game }) => {
    const isHomeFav = game.home_team === game.favorite;
    const isAwayFav = game.away_team === game.favorite;

    return (
      <div style={{ textAlign: "center", minWidth: 140 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
          <img src={game.away_logo} alt="" height={20} />
          {isAwayFav && <span>-{game.line_locked}</span>}
          <span>@</span>
          <img src={game.home_logo} alt="" height={20} />
          {isHomeFav && <span>-{game.line_locked}</span>}
        </div>

        <div style={{ fontSize: 10, color: "#666" }}>
          {game.game_clock}
        </div>
      </div>
    );
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div className="container">
      <h3>Player Picks</h3>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Player</th>
            {games.map(g => (
              <th key={g.id}>
                <GameHeader game={g} />
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {users.map(user => (
            <tr key={user.name}>
              <td>
                <b>{user.name}</b> ({user.points})
              </td>

              {games.map(game => {
                const pickObj = pickMap?.[game.id]?.[user.name];

                return (
                  <td
                    key={user.name + game.id}
                    style={getCellStyle(game, pickObj)}
                  >
                    <PickLogo game={game} pickObj={pickObj} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}