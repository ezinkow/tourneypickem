import React, { useEffect, useState } from "react";
import axios from "axios";
import BracketRegion from "../../components/bracket/BracketRegion";
import BracketGame from "../../components/bracket/BracketGame";

const GOLD = "#c89d3c";
const BLUE = "#13447a";
const REGIONS = ["South", "East", "Midwest", "West"];
const LOCK_TIME = new Date("2026-03-19T11:10:00-05:00");

export default function Bracket() {
    const [games, setGames] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userPicks, setUserPicks] = useState({});
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div style={{ padding: 80, textAlign: "center", color: BLUE }}>Loading bracket...</div>;

    return (
        <div style={{ paddingTop: 68, paddingBottom: 40, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
            {/* Header */}
            <div style={{
                background: `linear-gradient(135deg, ${BLUE} 0%, #1e5fa8 100%)`,
                color: "white",
                padding: "20px 24px",
                marginBottom: 24,
            }}>
                <div style={{ maxWidth: 1600, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                    <h2 style={{ margin: 0, color: GOLD, fontWeight: 900, fontSize: "clamp(18px, 3vw, 28px)" }}>
                        🗂️ 2026 NCAA Bracket
                    </h2>

                    {/* User dropdown */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>View bracket:</span>
                        <select
                            value={selectedUser || ""}
                            onChange={e => setSelectedUser(e.target.value || null)}
                            style={{
                                padding: "6px 12px", borderRadius: 6,
                                border: `2px solid ${GOLD}`,
                                backgroundColor: "white",
                                fontSize: 13, fontWeight: 600, color: BLUE,
                                cursor: "pointer",
                            }}
                        >
                            <option value="">— Actual Results —</option>
                            {standings.map(s => (
                                <option key={s.name} value={s.name}>
                                    {s.name} ({s.points} pts)
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* DESKTOP BRACKET */}
            <div className="bracket-desktop" style={{ overflowX: "hidden", padding: "0 8px" }}>
                <BracketScaler>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", width: 1600 }}>
                        {/* Left side: South + East */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 40, flex: 1 }}>
                            <BracketRegion region="South" games={gamesByRegion("South")} userPicks={userPicks} onPick={null} readonly={true} />
                            <BracketRegion region="East" games={gamesByRegion("East")} userPicks={userPicks} onPick={null} readonly={true} />
                        </div>
                        {/* Center: Final Four + Championship */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: 200, flexShrink: 0, paddingTop: 40 }}>
                            <div style={{ fontSize: 12, fontWeight: 800, color: BLUE, textTransform: "uppercase", letterSpacing: "1px", borderBottom: `2px solid ${GOLD}`, paddingBottom: 4, width: "100%", textAlign: "center", marginBottom: 8 }}>
                                Final Four
                            </div>
                            {finalFourGames.map(g => (
                                <BracketGame key={g.id} game={g} userPick={userPicks?.[g.id]} onPick={null} readonly={true} />
                            ))}
                            <div style={{ fontSize: 12, fontWeight: 800, color: GOLD, textTransform: "uppercase", letterSpacing: "1px", borderBottom: `2px solid ${GOLD}`, paddingBottom: 4, width: "100%", textAlign: "center", marginTop: 8 }}>
                                🏆 Championship
                            </div>
                            {championshipGame && (
                                <BracketGame game={championshipGame} userPick={userPicks?.[championshipGame.id]} onPick={null} readonly={true} />
                            )}
                        </div>
                        {/* Right side: Midwest + West */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 40, flex: 1 }}>
                            <BracketRegion region="Midwest" games={gamesByRegion("Midwest")} userPicks={userPicks} onPick={null} readonly={true} flipped={true} />
                            <BracketRegion region="West" games={gamesByRegion("West")} userPicks={userPicks} onPick={null} readonly={true} flipped={true} />
                        </div>
                    </div>
                </BracketScaler>
            </div>

            {/* MOBILE VIEW — tabs by region */}
            <div className="bracket-mobile" style={{ padding: "0 12px" }}>
                <MobileBracket
                    games={games}
                    userPicks={userPicks}
                    readonly={true}
                />
            </div>
        </div>
    );
}

function MobileBracket({ games, userPicks, onPick, readonly }) {
    const TABS = ["South", "East", "Midwest", "West", "Final Four"];
    const [activeTab, setActiveTab] = useState("South");

    const ROUND_LABELS = {
        1: "1st Round", 2: "2nd Round", 3: "Sweet 16",
        4: "Elite 8", 5: "Final Four", 6: "Championship"
    };

    const tabGames = activeTab === "Final Four"
        ? games.filter(g => g.round >= 5)
        : games.filter(g => g.region === activeTab);

    const byRound = {};
    for (const g of tabGames) {
        if (!byRound[g.round]) byRound[g.round] = [];
        byRound[g.round].push(g);
    }

    return (
        <div>
            {/* Tab bar */}
            <div style={{
                display: "flex",
                overflowX: "auto",
                gap: 4,
                marginBottom: 16,
                paddingBottom: 4,
            }}>
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: "6px 12px",
                            borderRadius: 20,
                            border: "none",
                            fontWeight: 700,
                            fontSize: 12,
                            whiteSpace: "nowrap",
                            cursor: "pointer",
                            backgroundColor: activeTab === tab ? BLUE : "#e5e7eb",
                            color: activeTab === tab ? "white" : "#374151",
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Games by round */}
            {Object.keys(byRound).sort().map(round => (
                <div key={round} style={{ marginBottom: 24 }}>
                    <div style={{
                        fontSize: 12, fontWeight: 800, color: BLUE,
                        textTransform: "uppercase", letterSpacing: "0.5px",
                        marginBottom: 8, paddingBottom: 4,
                        borderBottom: `2px solid ${GOLD}`,
                    }}>
                        {ROUND_LABELS[round]}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {byRound[round]
                            .sort((a, b) => a.bracket_slot - b.bracket_slot)
                            .map(game => (
                                <BracketGame
                                    key={game.id}
                                    game={game}
                                    userPick={userPicks?.[game.id]}
                                    onPick={onPick}
                                    readonly={readonly}
                                />
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );

}

function BracketScaler({ children }) {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const update = () => {
            const available = window.innerWidth - 32;
            const contentWidth = 1600;
            setScale(Math.min(1, available / contentWidth));
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    return (
        <div style={{ width: "100%", overflow: "hidden" }}>
            <div style={{
                width: 1600,
                transformOrigin: "top left",
                transform: `scale(${scale})`,
                paddingBottom: 40,
            }}>
                {children}
            </div>
        </div>
    );
}