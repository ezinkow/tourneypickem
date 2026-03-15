import React from "react";
import { useNavigate } from "react-router-dom";

const BLUE = "#13447a";
const DARK_BLUE = "#030831";
const GOLD = "#c89d3c";

export default function Home() {
    const navigate = useNavigate();
    return (
        <div style={{
            minHeight: "100vh",
            background: `linear-gradient(135deg, ${DARK_BLUE} 25%, ${GOLD} 50%, ${BLUE} 75%)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px 16px",
        }}>
            <h1 style={{
                color: GOLD,
                fontSize: "clamp(24px, 5vw, 48px)",
                fontWeight: 900,
                textAlign: "center",
                marginBottom: 8,
                marginTop: 35,
                letterSpacing: "2px",
                textTransform: "uppercase",
                textShadow: "0 2px 12px rgba(0,0,0,0.4)",
            }}>
                🏀 TOURNEY POOL CENTRAL 2026 🏀
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 48, fontSize: 16, textAlign: "center" }}>
                Choose your game
            </p>
            <div style={{
                display: "flex",
                gap: 24,
                flexWrap: "wrap",
                justifyContent: "center",
                width: "100%",
                maxWidth: 1200,
            }}>
                {/* Pick'em Card */}
                <div
                    onClick={() => navigate("/pickem")}
                    style={{
                        flex: 1, minWidth: 260, maxWidth: 360,
                        background: "white",
                        borderRadius: 16,
                        padding: 32,
                        cursor: "pointer",
                        borderTop: `6px solid ${BLUE}`,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                        transition: "transform 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🏀</div>
                    <h2 style={{ color: BLUE, marginBottom: 8, fontSize: 22, fontWeight: 800 }}>
                        Tourney Pick'em
                    </h2>
                    <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                        Pick every NCAA tournament game against the spread.
                        Games lock at tip-off. Best record wins.
                    </p>
                    <div style={{
                        display: "inline-block", padding: "10px 20px",
                        backgroundColor: BLUE, color: "white",
                        borderRadius: 8, fontWeight: 700, fontSize: 14,
                    }}>
                        Play Pick'em →
                    </div>
                </div>

                {/* Bracket Card */}
                <div
                    onClick={() => navigate("/bracket")}
                    style={{
                        flex: 1, minWidth: 260, maxWidth: 360,
                        background: "white",
                        borderRadius: 16,
                        padding: 32,
                        cursor: "pointer",
                        borderTop: `6px solid ${GOLD}`,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                        transition: "transform 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🗂️</div>
                    <h2 style={{ color: DARK_BLUE, marginBottom: 8, fontSize: 22, fontWeight: 800 }}>
                        Bracket Challenge
                    </h2>
                    <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                        Fill out your full bracket before the tournament starts.
                        Earn points for every correct pick where upsets are rewarded.
                    </p>
                    <div style={{
                        display: "inline-block", padding: "10px 20px",
                        backgroundColor: DARK_BLUE, color: "white",
                        borderRadius: 8, fontWeight: 700, fontSize: 14,
                    }}>
                        Play Bracket →
                    </div>
                </div>
                {/* Squares Card */}
                <div
                    onClick={() => navigate("/squares")}
                    style={{
                        flex: 1, minWidth: 260, maxWidth: 360,
                        background: "white", borderRadius: 16, padding: 32,
                        cursor: "pointer", borderTop: `6px solid #0369a1`,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                        transition: "transform 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🟩</div>
                    <h2 style={{ color: "#0369a1", marginBottom: 8, fontSize: 22, fontWeight: 800 }}>
                        Tournament Squares
                    </h2>
                    <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                        Claim your squares on the 10x10 grid. Win based on the last digit
                        of each game's final score. Bigger payouts each round.
                    </p>
                    <div style={{
                        display: "inline-block", padding: "10px 20px",
                        backgroundColor: "#0369a1", color: "white",
                        borderRadius: 8, fontWeight: 700, fontSize: 14,
                    }}>
                        Play Squares →
                    </div>
                </div>
            </div>
        </div>
    );
}