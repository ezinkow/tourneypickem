import React from 'react'
import { Link } from 'react-router-dom'
import CountdownDisplay from '../../components/bracket/CountdownDisplay'
import CountdownNextGameLock from '../../components/bracket/CountdownNextGameLock'
import Button from 'react-bootstrap/esm/Button'

const GOLD = "#c89d3c";
const BLUE = "#0369a1";

export default function Home() {
    return (
        <div>
            <div className="page-content">   {/* ← ADD THIS */}
                <CountdownDisplay />
                {/* <CountdownNextGameLock /> */}
                <div className='container'>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                        <Link to="/bracket/signup" style={{ textDecoration: 'none' }}>
                            <button
                                type="submit"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    backgroundColor: "var(--primary-navy)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 8,
                                    fontSize: 15,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                }}
                            >
                                📋 Sign Up Here 🚀
                            </button>
                        </Link>
                        <Link to="/bracket/mybracket">
                            <button
                                type="submit"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    backgroundColor: "var(--primary-navy)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 8,
                                    fontSize: 15,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                }}>
                                🏀 Make Your Bracket 🗑️
                            </button>
                        </Link>
                    </div>
                    <br />
                    <div style={{
                        background: "white", borderRadius: 16, padding: "24px 28px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.07)", marginBottom: 24,
                        borderTop: `4px solid ${GOLD}`
                    }}>
                        < ul >
                            <h3 style={{ color: BLUE, marginTop: 0, marginBottom: 16 }}>📋 Game Rules</h3>
                            <li>Predict the outcome of the Men's NCAA Tournament</li>
                            <li>Points double each round (Round 1 = 1 point, Sweet 16 = 8 points, etc.)</li>
                            <li>You <strong>also get</strong> points equal to the seed of your correct pick</li>
                            <ul>
                                <li>Example 1: You pick a 12 seed to win in round 1. The 12 seed wins, you get 13 points (1 + 12)</li>
                                <li>Example 2: You pick a 4 seed to win in round 2. The 4 seed wins, you get 6 points (2 + 4)</li>
                            </ul>
                            <li>Most points at the end wins!</li>
                            <li>25/bracket. Max 2 brackets</li>
                        </ul>
                    </div>
                    <br /><br />
                    <a href="https://www.ncaa.com/march-madness-live/scores"
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            display: "inline-block",
                            padding: "12px 24px",
                            backgroundColor: "var(--primary-navy)",
                            color: "white",
                            border: "none",
                            borderRadius: 8,
                            fontSize: 15,
                            fontWeight: 700,
                            cursor: "pointer",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            textDecoration: "none",
                        }}>
                        📋 Tourney Scores ↗
                    </a>
                </div>
            </div >
        </div >
    )
}