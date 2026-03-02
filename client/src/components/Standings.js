import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/esm/Table";

const Standings = () => {
    const [standings, setStandings] = useState([]);

    useEffect(() => {
        axios.get("/api/standings").then(res => setStandings(res.data));
    }, []);

    return (
        <div className="standings table-scroll-wrapper">
            <h2>Standings</h2>
            <Table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>User</th>
                        <th>Points</th>
                        <th>Correct Picks</th>
                        <th>Correct Missed (.5 pt) Picks</th>
                    </tr>
                </thead>
                <tbody>
                    {standings.map((s, idx) => (
                        <tr key={s.user_id}>
                            <td>
                                {idx === 0 && "🥇 "}
                                {idx === 1 && "🥈 "}
                                {idx === 2 && "🥉 "}
                                {idx + 1}
                            </td>
                            <td>{s.name}</td>
                            <td>{s.points}</td>
                            <td>{s.correct}</td>
                            <td>{s.missed}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Standings;