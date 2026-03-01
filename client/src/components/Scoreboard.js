import React, { useEffect, useState } from "react";
import axios from "axios";
import RefreshGamesButton from './RefreshGamesButton'

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
        // Note: match the variable name line_locked from your Model
        if (g.line === null || g.status !== "STATUS_FINAL") return null;

        const favIsHome = g.favorite === g.home_team;
        const favScore = favIsHome ? g.home_score : g.away_score;
        const dogScore = favIsHome ? g.away_score : g.home_score;

        // A favorite covers if (Fav Score - Spread) > Dog Score
        return (favScore - g.line) > dogScore;
    };

       // Result Logic Helper
    // const renderResultIcon = (g) => {
    //     // Access the associated Game data
    //     const game = g.Game;

    //     // Don't show icons if game isn't over or data is missing
    //     if (!game || game.status !== "STATUS_FINAL" || !game.winner) {
    //         return null;
    //     }

    //     if (game.winner === "PUSH") {
    //         return <span style={{ marginLeft: "8px", color: "orange" }}>➖</span>;
    //     }

    //     const isCorrect = g.pick === game.winner;

    //     return isCorrect ? (
    //         <span style={{ marginLeft: "8px", color: "green", fontWeight: "bold" }}>✅</span>
    //     ) : (
    //         <span style={{ marginLeft: "8px", color: "red", fontWeight: "bold" }}>❌</span>
    //     );
    // };

    return (
        <div className="scoreboard-container">
            <div style={{ whiteSpace: 'nowrap' }}>
                <h2>Scoreboard<RefreshGamesButton /></h2><strong>(Home team in bold)</strong>
            </div>

            <table className="scoreboard-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Underdog</th>
                        <th>Favorite</th>
                        <th>Line</th>
                        <th>Score</th>
                        <th>Covered</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {games.map((g) => {
                        const favCovered = didFavoriteCover(g);
                        console.log(g)
                        return (
                            <tr key={g.id}>
                                {/* DATE */}
                                <td>
                                    {formatDateET(g.game_date)} – {formatTimeET(g.game_date)}
                                </td>

                                {/* UNDERDOG */}
                                <td style={{ fontWeight: g.underdog === g.home_team ? "bold" : "normal" }}>
                                    {g.dog_logo && (
                                        <img
                                            src={g.dog_logo}
                                            width="24"
                                            style={{ marginRight: 6 }}
                                        />
                                    )}
                                    {g.underdog}
                                </td>

                                {/* FAVORITE */}
                                <td style={{ fontWeight: g.favorite === g.home_team ? "bold" : "normal" }}>
                                    {g.fav_logo && (
                                        <img
                                            src={g.fav_logo}
                                            width="24"
                                            style={{ marginRight: 6 }}
                                        />
                                    )}
                                    {g.favorite}
                                </td>

                                {/* LINE */}
                                <td>
                                    <img
                                        src={g.fav_logo}
                                        width="24"
                                        style={{ marginRight: 6 }}
                                    />-{g.line ?? "TBD"}
                                </td>

                                {/* SCORE */}
                                <td>
                                    <img
                                        src={g.away_logo}
                                        width="24"
                                        style={{ marginRight: 3 }}
                                    />{g.away_score} - {g.home_score}  <img
                                        src={g.home_logo}
                                        width="24"
                                        style={{ marginLeft: 3 }}
                                    />
                                </td>

                                {/* COVERED */}
                                <td>
                                    {g.status === "STATUS_FINAL" &&
                                        (favCovered ? (
                                            <span style={{ color: "green", fontWeight: "bold" }}>
                                                <img
                                                    src={g.fav_logo}
                                                    width="24"
                                                    style={{ marginRight: 6 }}
                                                /> ✓
                                            </span>
                                        ) : (
                                            <span style={{ color: "red", fontWeight: "bold" }}>
                                                <img
                                                    src={g.dog_logo}
                                                    width="24"
                                                    style={{ marginRight: 6 }}
                                                /> ✓
                                            </span>
                                        ))}
                                </td>

                                {/* STATUS */}
                                <td>
                                    {g.game_clock}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div >
    );
};

export default Scoreboard;