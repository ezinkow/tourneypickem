import React, { useEffect, useState } from "react";
import axios from "axios";
import RefreshGamesButton from './RefreshGamesButton';

const isLiveOrFinal = (status) =>
    status === "STATUS_IN_PROGRESS" || status === "STATUS_FINAL";

function formatDateET(date) {
    return new Date(date).toLocaleDateString("en-US", {
        timeZone: "America/New_York",
        month: "short",
        day: "numeric",
    });
}

function formatTimeET(date) {
    return new Date(date).toLocaleTimeString("en-US", {
        timeZone: "America/New_York",
        hour: "numeric",
        minute: "2-digit",
    });
}

const Scoreboard = () => {
    const [games, setGames] = useState([]);

    const fetchGames = async () => {
        const res = await axios.get("/api/games/history");
        setGames(res.data.filter((g) => isLiveOrFinal(g.status)));
    };

    useEffect(() => {
        fetchGames();
        const interval = setInterval(fetchGames, 30000);
        return () => clearInterval(interval);
    }, []);

    const didFavoriteCover = (g) => {
        if (g.line === null || g.status !== "STATUS_FINAL") return null;
        const favIsHome = g.favorite === g.home_team;
        const favScore = favIsHome ? g.home_score : g.away_score;
        const dogScore = favIsHome ? g.away_score : g.home_score;
        return (favScore - g.line) > dogScore;
    };

    return (
        <div className="scoreboard-container">
            <div className="scoreboard-header">
                <h2>🔢 Scoreboard 🆚<RefreshGamesButton /></h2>
                <strong>(Home team in bold/gold border)</strong>
            </div>
            <div className="table-scroll-wrapper">
                <table className="scoreboard-table">
                    <thead>
                        <tr>
                            <th><span className="hide-mobile">Date</span><span className="show-mobile">Date</span></th>
                            <th><span className="hide-mobile">Underdog</span><span className="show-mobile">Dog</span></th>
                            <th><span className="hide-mobile">Favorite</span><span className="show-mobile">Fav</span></th>
                            <th><span className="hide-mobile">Line</span><span className="show-mobile">Line</span></th>
                            <th><span className="hide-mobile">Score</span><span className="show-mobile">Score</span></th>
                            <th><span className="hide-mobile">Covered</span><span className="show-mobile">Cvrd</span></th>
                            <th><span className="hide-mobile">Status/Clock</span><span className="show-mobile">Status</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {games.map((g) => {
                            const favCovered = didFavoriteCover(g);
                            return (
                                <tr key={g.id}>
                                    {/* DATE — show short on mobile */}
                                    <td>
                                        <span className="hide-mobile">
                                            {formatDateET(g.game_date)} –{" "}
                                        </span>
                                        {formatTimeET(g.game_date)}
                                    </td>

                                    {/* UNDERDOG */}
                                    <td style={{ fontWeight: g.underdog === g.home_team ? "bold" : "normal" }}>
                                        {g.dog_logo && (
                                            <img src={g.dog_logo} width="24" alt={g.underdog} title={g.underdog} style={{ marginRight: 4 }} className={g.underdog === g.home_team ? "home-team-logo" : ""} />
                                        )}
                                        <span className="hide-mobile">{g.underdog}</span>
                                    </td>

                                    {/* FAVORITE */}
                                    <td style={{ fontWeight: g.favorite === g.home_team ? "bold" : "normal" }}>
                                        {g.fav_logo && (
                                            <img src={g.fav_logo} width="24" alt={g.favorite} title={g.favorite} style={{ marginRight: 4 }} className={g.favorite === g.home_team ? "home-team-logo" : ""} />
                                        )}
                                        <span className="hide-mobile">{g.favorite}</span>
                                    </td>

                                    {/* LINE */}
                                    <td>
                                        <img src={g.fav_logo} width="24" alt="" style={{ marginRight: 4 }} className="hide-mobile" />
                                        -{g.line ?? "TBD"}
                                    </td>

                                    {/* SCORE */}
                                    <td style={{ whiteSpace: "nowrap" }}>
                                        <img src={g.away_logo} width="20" alt="" style={{ marginRight: 3 }} />
                                        {g.away_score}–{g.home_score}
                                        <img src={g.home_logo} width="20" alt="" style={{ marginLeft: 3 }} />
                                    </td>

                                    {/* COVERED */}
                                    <td>
                                        {g.status === "STATUS_FINAL" && (
                                            favCovered ? (
                                                <span style={{ color: "green", fontWeight: "bold" }}>
                                                    <img src={g.fav_logo} width="20" alt="" style={{ marginRight: 3 }} /> ✓
                                                </span>
                                            ) : (
                                                <span style={{ color: "red", fontWeight: "bold" }}>
                                                    <img src={g.dog_logo} width="20" alt="" style={{ marginRight: 3 }} /> ✓
                                                </span>
                                            )
                                        )}
                                    </td>

                                    {/* STATUS */}
                                    <td>{g.game_clock}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Scoreboard;