import React, { useEffect, useState } from "react";
import axios from "axios";

const Standings = () => {
    const [standings, setStandings] = useState([]);

    useEffect(() => {
        axios.get("/api/standings").then(res => setStandings(res.data)
        );
    }, []);
    console.log(standings)

    return (
        <div className="standings">
            <h2>Standings</h2>
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Points</th>
                        <th>Correct Picks</th>
                        <th>Missed (.5 pt) Picks</th>
                    </tr>
                </thead>
                <tbody>
                    {standings.map(s => (
                        <tr key={s.user_id}>
                            <td>{s.name}</td>
                            <td>{s.points}</td>
                            <td>{s.correct}</td>
                            <td>{s.missed}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Standings;