import React from 'react'
import { Link } from 'react-router-dom'
import CountdownDisplay from '../../components/pickem/CountdownDisplay'
import CountdownNextGameLock from '../../components/pickem/CountdownNextGameLock'
import Button from 'react-bootstrap/esm/Button'

export default function Home() {
    return (
        <div>
            <div className="page-content">   {/* ← ADD THIS */}
                <CountdownDisplay />
                {/* <CountdownNextGameLock /> */}
                <div className='container'>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                        <Link to="/signup" style={{ textDecoration: 'none' }}>
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
                        <Link to="/picks">
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
                    <strong>The game:</strong><br />
                    Runs from March 17 - April 6<br />
                    Pick every NCAA tournament game <strong><u>against the spread</u></strong><br />
                    Games lock at scheduled tip-off time.<br />
                    Lines lock one hour before scheduled tip-off time.<br />
                    No matter what the line is when pick is submitted, the final, closed locked line will be the line everyone is using.
                    <br /><br />
                    <a href="https://www.ncaa.com/news/basketball-men/article/2026-02-11/tracking-31-ncaa-mens-basketball-conference-tournaments-auto-bids-2026-march"
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