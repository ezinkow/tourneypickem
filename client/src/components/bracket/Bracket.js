import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import BracketRegion from "../../components/bracket/BracketRegion";
import BracketGame from "../../components/bracket/BracketGame";

const GOLD = "#c89d3c";
const BLUE = "#13447a";
const ROUND_LABELS = {
    1: "1st Round", 2: "2nd Round", 3: "Sweet 16",
    4: "Elite 8", 5: "Final Four", 6: "Championship"
};
const TABS = ["South", "East", "Midwest", "West", "Final Four"];

export default function Bracket() {
    const [games, setGames] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userPicks, setUserPicks] = useState({});
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);
    const LOCK_TIME = new Date("2026-03-19T11:10:00-05:00");
    const isLocked = new Date() >= LOCK_TIME;

    useEffect(() => {
        Promise.all([
            axios.get("/api/bracket/games"),
            axios.get("/api/bracket/users"),
            axios.get("/api/bracket/standings"),
        ]).then(([gamesRes, usersRes, standingsRes]) => {
            setGames(gamesRes.data);
            setUsers(usersRes.data);
            setStandings(standingsRes.data);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (!selectedUser) { setUserPicks({}); return; }
        axios.get("/api/bracket/picks", { params: { name: selectedUser } })
            .then(res => {
                const map = {};
                for (const p of res.data) map[p.game_id] = p.pick;
                setUserPicks(map);
            });
    }, [selectedUser]);

    const gamesByRegion = (region) => games.filter(g => g.region === region);
    const finalFourGames = games.filter(g => g.round === 5);
    const championshipGame = games.find(g => g.round === 6);

    // Only show other users' picks after lock
    const displayPicks = isLocked ? userPicks : {};

    if (loading) return <div style={{ padding: 80, textAlign: "center", color: BLUE }}>Loading bracket...</div>;

    return (
        <div style={{ paddingTop: 68, paddingBottom: 40, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
            {/* Header */}
            <div style={{
                background: `linear-gradient(135deg, ${BLUE} 0%, #1e5fa8 100%)`,
                color: "white", padding: "20px 24px", marginBottom: 24,
            }}>
                <div style={{ maxWidth: 1600, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                    <h2 style={{ margin: 0, color: GOLD, fontWeight: 900, fontSize: "clamp(18px, 3vw, 28px)" }}>
                        🗂️ 2026 NCAA Bracket
                    </h2>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>View bracket:</span>
                        <select
                            value={selectedUser || ""}
                            onChange={e => setSelectedUser(e.target.value || null)}
                            style={{
                                padding: "6px 12px", borderRadius: 6,
                                border: `2px solid ${GOLD}`, backgroundColor: "white",
                                fontSize: 13, fontWeight: 600, color: BLUE, cursor: "pointer",
                            }}
                        >
                            <option value="">— Actual Results —</option>
                            {standings.map(s => (
                                <option key={s.name} value={s.name}>{s.name} ({s.points} pts)</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* DESKTOP BRACKET */}
            <div className="bracket-desktop" style={{ overflowX: "hidden", padding: "0 8px" }}>
                <BracketScaler>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", width: 1600 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 40, flex: 1 }}>
                            <BracketRegion region="East" games={gamesByRegion("East")} displayPicks={displayPicks} onPick={null} readonly={true} />
                            <BracketRegion region="South" games={gamesByRegion("South")} displayPicks={displayPicks} onPick={null} readonly={true} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: 200, flexShrink: 0, paddingTop: 40 }}>
                            <div style={{ fontSize: 12, fontWeight: 800, color: BLUE, textTransform: "uppercase", letterSpacing: "1px", borderBottom: `2px solid ${GOLD}`, paddingBottom: 4, width: "100%", textAlign: "center", marginBottom: 8 }}>
                                Final Four
                            </div>
                            {finalFourGames.map(g => (
                                <BracketGame key={g.id} game={g} userPick={displayPicks?.[g.id]} onPick={null} readonly={true} />
                            ))}
                            <div style={{ fontSize: 12, fontWeight: 800, color: GOLD, textTransform: "uppercase", letterSpacing: "1px", borderBottom: `2px solid ${GOLD}`, paddingBottom: 4, width: "100%", textAlign: "center", marginTop: 8 }}>
                                🏆 Championship
                            </div>
                            {championshipGame && (
                                <BracketGame game={championshipGame} userPick={displayPicks?.[championshipGame.id]} onPick={null} readonly={true} />
                            )}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 40, flex: 1 }}>
                            <BracketRegion region="West" games={gamesByRegion("West")} displayPicks={displayPicks} onPick={null} readonly={true} flipped={true} />
                            <BracketRegion region="Midwest" games={gamesByRegion("Midwest")} displayPicks={displayPicks} onPick={null} readonly={true} flipped={true} />
                        </div>
                    </div>
                </BracketScaler>
            </div>

            {/* MOBILE */}
            <div className="bracket-mobile" style={{ padding: "0 12px" }}>
                <MobileBracket games={games} displayPicks={displayPicks} readonly={true} />
            </div>
        </div>
    );
}

function MobileBracket({ games, displayPicks, readonly }) {
    const [activeTab, setActiveTab] = useState("South");
    const [collapsedRounds, setCollapsedRounds] = useState(new Set());

    const tabGames = activeTab === "Final Four"
        ? games.filter(g => g.round >= 5)
        : games.filter(g => g.region === activeTab);

    const byRound = {};
    for (const g of tabGames) {
        if (!byRound[g.round]) byRound[g.round] = [];
        byRound[g.round].push(g);
    }

    const toggleCollapse = (roundIdx) => {
        setCollapsedRounds(prev => {
            const next = new Set(prev);
            if (next.has(roundIdx)) next.delete(roundIdx);
            else next.add(roundIdx);
            return next;
        });
    };

    return (
        <div>
            {/* Tab bar */}
            <div style={{ display: "flex", overflowX: "auto", gap: 4, marginBottom: 16, paddingBottom: 4 }}>
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setCollapsedRounds(new Set()); }}
                        style={{
                            padding: "6px 12px", borderRadius: 20, border: "none",
                            fontWeight: 700, fontSize: 12, whiteSpace: "nowrap", cursor: "pointer",
                            backgroundColor: activeTab === tab ? BLUE : "#e5e7eb",
                            color: activeTab === tab ? "white" : "#374151",
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Horizontal collapsing bracket */}
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start", paddingBottom: 16 }}>
                    {Object.keys(byRound).sort((a, b) => a - b).map((round, roundIdx) => {
                        const isCollapsed = collapsedRounds.has(roundIdx);
                        return (
                            <div key={round} style={{ flexShrink: 0 }}>
                                {/* Round label — tap to toggle */}
                                <div
                                    onClick={() => toggleCollapse(roundIdx)}
                                    style={{
                                        fontSize: 10, fontWeight: 700,
                                        color: isCollapsed ? BLUE : "#9ca3af",
                                        textAlign: "center", marginBottom: 6,
                                        textTransform: "uppercase", letterSpacing: "0.5px",
                                        whiteSpace: "nowrap", cursor: "pointer",
                                        padding: "2px 4px", borderRadius: 4,
                                        backgroundColor: isCollapsed ? "#eff6ff" : "transparent",
                                        userSelect: "none",
                                    }}>
                                    {isCollapsed ? "▶" : "▼"} {ROUND_LABELS[round].split(" ")[0]}
                                </div>

                                {/* Games */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {byRound[round]
                                        .sort((a, b) => a.bracket_slot - b.bracket_slot)
                                        .map(game => {
                                            const pick = displayPicks?.[game.id];
                                            if (isCollapsed) {
                                                const logo = pick === game.home_team ? game.home_logo
                                                    : pick === game.away_team ? game.away_logo
                                                        : null;
                                                return (
                                                    <div key={game.id}
                                                        onClick={() => toggleCollapse(roundIdx)}
                                                        style={{
                                                            width: 36, height: 48, borderRadius: 6,
                                                            border: `1px solid ${pick ? BLUE : "#e5e7eb"}`,
                                                            backgroundColor: pick ? "#eff6ff" : "#f9fafb",
                                                            display: "flex", alignItems: "center",
                                                            justifyContent: "center", cursor: "pointer",
                                                        }}>
                                                        {pick
                                                            ? logo
                                                                ? <img src={logo} width={20} height={20} alt="" style={{ objectFit: "contain" }} />
                                                                : <span style={{ fontSize: 8, fontWeight: 700, color: BLUE, textAlign: "center", padding: "0 2px", lineHeight: 1.2 }}>
                                                                    {pick.substring(0, 4)}
                                                                </span>
                                                            : <span style={{ fontSize: 10, color: "#d1d5db" }}>·</span>
                                                        }
                                                    </div>
                                                );
                                            }
                                            return (
                                                <BracketGame
                                                    key={game.id}
                                                    game={game}
                                                    userPick={pick}
                                                    onPick={null}
                                                    readonly={readonly}
                                                />
                                            );
                                        })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function BracketScaler({ children }) {
    const [scale, setScale] = useState(1);
    useEffect(() => {
        const update = () => {
            const available = window.innerWidth - 32;
            setScale(Math.min(1, available / 1600));
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);
    return (
        <div style={{ width: "100%", overflow: "hidden" }}>
            <div style={{
                width: 1600, transformOrigin: "top left",
                transform: `scale(${scale})`, paddingBottom: 40,
            }}>
                {children}
            </div>
        </div>
    );
}