import React from "react";
import { useNavigate } from "react-router-dom";

const BLUE = "#13447a";
const DARK_BLUE = "#030831";
const GOLD = "#c89d3c";
const NBA_NAVY = "#0a1628";
const NBA_RED = "#c8102e";
const GRAY = "#9ca3af";

export default function Home() {
    const navigate = useNavigate();

    const cards = [
        {
            emoji: "🏆",
            title: "NBA Playoffs Pool",
            description: "Pick the winner of every playoff series, assign confidence points, and guess the series length for a 2× bonus.",
            cta: "Play NBA Pool →",
            route: "/nba",
            accent: NBA_RED,
            ctaBg: NBA_NAVY,
            titleColor: NBA_NAVY,
            isActive: true,
        },
        // ... (rest of your cards stay the same)
        {
            emoji: "🏀",
            title: "Tourney Pick'em",
            description: "Pick every NCAA tournament game against the spread. Games lock at tip-off. Best record wins.",
            cta: "Season Ended",
            route: "/pickem",
            accent: BLUE,
            ctaBg: GRAY,
            titleColor: BLUE,
            isActive: false,
        },
        {
            emoji: "🗂️",
            title: "Bracket Challenge",
            description: "Fill out your full bracket before the tournament starts. Earn points for correct picks where upsets are rewarded.",
            cta: "Season Ended",
            route: "/bracket",
            accent: GOLD,
            ctaBg: GRAY,
            titleColor: DARK_BLUE,
            isActive: false,
        },
        {
            emoji: "🟩",
            title: "Tourney Squares",
            description: "Claim your squares on the 10×10 grid. Win based on the last digit of each game's final score.",
            cta: "Season Ended",
            route: "/squares",
            accent: "#0369a1",
            ctaBg: GRAY,
            titleColor: "#0369a1",
            isActive: false,
        },
    ];

    return (
        <div style={{
            minHeight: "100vh",
            background: `linear-gradient(135deg, ${DARK_BLUE} 25%, ${GOLD} 50%, ${BLUE} 75%)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // Changed from center to flex-start to prevent "crowding" the navbar on mobile
            justifyContent: "flex-start",
            // Increased top padding from 24px to 60px
            padding: "60px 16px 40px 16px",
        }}>
            <h1 style={{
                color: GOLD,
                fontSize: "clamp(22px, 5vw, 46px)",
                fontWeight: 900,
                textAlign: "center",
                marginBottom: 8,
                // Adjusted marginTop for better breathing room
                marginTop: 20,
                letterSpacing: "2px",
                textTransform: "uppercase",
                textShadow: "0 2px 12px rgba(0,0,0,0.4)",
            }}>
                🏆 POOL PLAY 🏊
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 48, fontSize: 16, textAlign: "center" }}>
                <strong>Come on in, the water's warm!</strong>
            </p>

            <div style={{
                display: "flex",
                gap: 24,
                flexWrap: "wrap",
                justifyContent: "center",
                width: "100%",
                maxWidth: 1200,
            }}>
                {cards.map((card) => {
                    const { emoji, title, description, cta, route, accent, ctaBg, titleColor, isActive } = card;

                    return (
                        <div
                            key={route}
                            onClick={() => isActive && navigate(route)}
                            style={{
                                flex: 1, minWidth: 260, maxWidth: 360,
                                background: isActive ? "white" : "#f3f4f6",
                                borderRadius: 16,
                                padding: 32,
                                cursor: isActive ? "pointer" : "default",
                                borderTop: `6px solid ${isActive ? accent : GRAY}`,
                                boxShadow: isActive ? "0 8px 32px rgba(0,0,0,0.3)" : "none",
                                transition: "all 0.15s",
                                filter: isActive ? "none" : "grayscale(100%) opacity(0.7)",
                                position: "relative"
                            }}
                            onMouseEnter={e => {
                                if (isActive) e.currentTarget.style.transform = "translateY(-4px)";
                            }}
                            onMouseLeave={e => {
                                if (isActive) e.currentTarget.style.transform = "translateY(0)";
                            }}
                        >
                            {!isActive && (
                                <div style={{
                                    position: "absolute",
                                    top: 12,
                                    right: 12,
                                    fontSize: 10,
                                    fontWeight: 800,
                                    color: GRAY,
                                    textTransform: "uppercase"
                                }}>
                                    Inactive
                                </div>
                            )}

                            <div style={{ fontSize: 48, marginBottom: 12 }}>{emoji}</div>
                            <h2 style={{ color: isActive ? titleColor : GRAY, marginBottom: 8, fontSize: 22, fontWeight: 800 }}>
                                {title}
                            </h2>
                            <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                                {description}
                            </p>
                            <div style={{
                                display: "inline-block", padding: "10px 20px",
                                backgroundColor: isActive ? ctaBg : "#d1d5db",
                                color: "white",
                                borderRadius: 8, fontWeight: 700, fontSize: 14,
                            }}>
                                {cta}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}