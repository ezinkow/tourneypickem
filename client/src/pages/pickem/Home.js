import React from 'react'
import { Link } from 'react-router-dom'
import CountdownDisplay from '../../components/CountdownDisplay'
import CountdownNextGameLock from '../../components/pickem/CountdownNextGameLock'
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
                        <Link to="/pickem/signup" style={{ textDecoration: 'none' }}>
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
                        <Link to="/pickem/picks">
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
                                🏀 Make Your Picks 🗑️
                            </button>
                        </Link>
                    </div>
                    <br />
                    <div style={{
                        background: "white", borderRadius: 16, padding: "24px 28px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.07)", marginBottom: 24,
                        borderTop: `4px solid ${GOLD}`,
                    }}>
                        <h3 style={{ color: BLUE, marginTop: 0, marginBottom: 16 }}>📋 Game Rules</h3>
                        <li>Runs from March 19 - April 6</li>
                        <li>Pick every NCAA tournament game <strong><u>against the spread</u></strong></li>
                        <li>Games lock at scheduled tip-off time.</li>
                        <li>Lines lock one hour before scheduled tip-off time.</li>
                        <li>No matter what the line is when pick is submitted, the final, closed locked line will be the line everyone is using.</li>
                        <li>100/entry</li>
                    </div>
                    <a href="https://www.ncaa.com/march-madness-live/bracket"
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
                        📋 Tourney Bracket ↗
                    </a>
                </div>
            </div>
        </div >
    )
}