import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import CountdownDisplay from '../../components/CountdownDisplay';
import CountdownNextGameLock from '../../components/nba/CountdownNextSeriesLock';

const GOLD = "#c89d3c";
const BLUE = "#0369a1";
const GAME_LOCK_SWITCHOVER = new Date("2026-04-18T16:00:00Z"); // NBA Playoffs Start

export default function Home() {
    const { user: authUser } = useAuth();
    const [hasEntry, setHasEntry] = useState(false);
    const [loading, setLoading] = useState(false);
    const gameLocked = new Date() >= GAME_LOCK_SWITCHOVER;

    useEffect(() => {
        if (authUser) {
            axios.get(`/api/nba/entries/check/${authUser.name}`)
                .then(res => setHasEntry(res.data.exists))
                .catch(() => setHasEntry(false));
        }
    }, [authUser]);

    const handleCreateEntry = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post("/api/nba/entries/create",
                { name: authUser.name },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setHasEntry(true);
            toast.success("Entry Created! Good luck!");
        } catch (err) {
            toast.error("Failed to create entry.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Toaster />
            <div className="page-content">
                {gameLocked ? <CountdownNextGameLock /> : <CountdownDisplay />}

                <div className='container' style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: 24 }}>
                        {!authUser ? (
                            <Link to="/nba/picks">
                                <button className="btn-nba-main">Sign In to Play</button>
                            </Link>
                        ) : !hasEntry ? (
                            <button
                                onClick={handleCreateEntry}
                                disabled={loading}
                                className="btn-nba-main"
                                style={{ backgroundColor: "#16a34a" }}
                            >
                                {loading ? "Creating..." : "🚀 Join NBA Playoff Pool"}
                            </button>
                        ) : (
                            <Link to="/nba/picks">
                                <button className="btn-nba-main">🏀 Manage My Picks</button>
                            </Link>
                        )}
                    </div>

                    <div style={{
                        background: "white", borderRadius: 16, padding: "24px 28px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.07)", marginBottom: 24,
                        borderTop: `4px solid ${GOLD}`, textAlign: 'left'
                    }}>
                        <h3 style={{ color: BLUE, marginTop: 0, marginBottom: 16 }}>📋 NBA Playoff Rules</h3>
                        <ul style={{ paddingLeft: 20, lineHeight: '1.8' }}>
                            <li>Pick the winner of each playoff series.</li>
                            <li>Assign <strong>Confidence Points</strong> to each pick (1 to Round Max).</li>
                            <li>Correct Winner = Points Earned.</li>
                            <li><strong>Double Points:</strong> Correctly predict the series length (4, 5, 6, or 7 games).</li>
                            <li>Series lock 1 hour before their next scheduled tip-off.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <style>{`
                .btn-nba-main {
                    padding: 14px 32px;
                    background-color: var(--primary-navy);
                    color: white;
                    border: none;
                    border-radius: 8;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    transition: opacity 0.2s;
                }
                .btn-nba-main:hover { opacity: 0.9; }
            `}</style>
        </div>
    );
}