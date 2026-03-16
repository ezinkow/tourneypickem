import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import BracketGame from "../../components/bracket/BracketGame";
import BracketRegion from "../../components/bracket/BracketRegion";

const GOLD = "#c89d3c";
const BLUE = "#13447a";
const LOCK_TIME = new Date("2026-03-19T11:10:00-05:00");

const ROUND_LABELS = {
    1: "1st Round", 2: "2nd Round", 3: "Sweet 16",
    4: "Elite 8", 5: "Final Four", 6: "Championship"
};

const REGIONS = ["South", "East", "Midwest", "West"];
const TABS = ["South", "East", "Midwest", "West", "Final Four"];

export default function MyBracket() {
    const [games, setGames] = useState([]);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState("SELECT YOUR NAME");
    const [password, setPassword] = useState("");
    const [authenticated, setAuthenticated] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [picks, setPicks] = useState({}); // { [gameId]: teamName }
    const [activeTab, setActiveTab] = useState("South");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const isLocked = new Date() >= LOCK_TIME;

    useEffect(() => {
        axios.get("/api/bracket/games").then(res => setGames(res.data));
        axios.get("/api/bracket/users").then(res =>
            setUsers(res.data.sort((a, b) => a.name.localeCompare(b.name)))
        );

        // Check remembered login
        const saved = localStorage.getItem("rememberedUserBracket");
        if (saved) {
            const { name, token } = JSON.parse(saved);
            axios.post("/api/bracket/users/verify-token", { name, token })
                .then(res => {
                    if (res.data.success) {
                        setUser(name);
                        setAuthenticated(true);
                    } else {
                        localStorage.removeItem("rememberedUserBracket");
                    }
                })
                .catch(() => localStorage.removeItem("rememberedUserBracket"));
        }
    }, []);

    // Load picks after auth + games are loaded
    useEffect(() => {
        if (!authenticated || user === "SELECT YOUR NAME" || games.length === 0) return;
        setLoading(true);
        axios.get("/api/bracket/picks", { params: { name: user } })
            .then(res => {
                const map = {};
                for (const p of res.data) map[p.game_id] = p.pick;
                setPicks(map);
            })
            .finally(() => setLoading(false));
    }, [authenticated, user, games]);

    const verify = async () => {
        try {
            const res = await axios.post("/api/bracket/users/verify", { name: user, password });
            if (!res.data.success) return toast.error("Wrong password");
            setAuthenticated(true);
            toast.success("Identity verified!");
            if (rememberMe) {
                localStorage.setItem("rememberedUserBracket", JSON.stringify({
                    name: user, token: res.data.token
                }));
            }
        } catch {
            toast.error("Verify failed");
        }
    };

    const logout = async () => {
        const saved = localStorage.getItem("rememberedUserBracket");
        if (saved) {
            const { token } = JSON.parse(saved);
            await axios.post("/api/bracket/users/logout", { token });
            localStorage.removeItem("rememberedUserBracket");
        }
        setAuthenticated(false);
        setUser("SELECT YOUR NAME");
        setPicks({});
    };

    // When user picks a team, advance them through subsequent rounds
    const handlePick = (gameId, teamName) => {
        if (isLocked || !authenticated) return;

        const game = games.find(g => g.id === gameId);
        if (!game) return;

        setPicks(prev => {
            const next = { ...prev };

            // If changing an existing pick, clear downstream picks
            const oldPick = prev[gameId];
            if (oldPick && oldPick !== teamName) {
                clearDownstream(next, oldPick, game.round, game.region);
            }

            next[gameId] = teamName;
            return next;
        });
    };

    // Recursively clear picks that depended on a team that was changed
    const clearDownstream = (picksMap, removedTeam, fromRound, region) => {
        for (const g of games) {
            if (picksMap[g.id] === removedTeam && g.round > fromRound) {
                const old = picksMap[g.id];
                delete picksMap[g.id];
                if (old) clearDownstream(picksMap, old, g.round, g.region);
            }
        }
    };

    const gamesByRegion = (region) => games.filter(g => g.region === region);
    const finalFourGames = games.filter(g => g.round === 5);
    const championshipGame = games.find(g => g.round === 6);

    const handleSave = async () => {
        if (isLocked) return toast.error("Bracket is locked");
        setSaving(true);
        try {
            const payload = {
                name: user,
                picks: Object.entries(picks).map(([game_id, pick]) => ({ game_id, pick }))
            };
            await axios.post("/api/bracket/picks/bulk", payload);
            toast.success("Bracket saved!");
        } catch {
            toast.error("Save failed");
        } finally {
            setSaving(false);
        }
    };

    // Build next-round game lookup: given a team's current game, find the game they'd play next
    const getNextRoundGame = (currentGame) => {
        if (!currentGame) return null;
        const nextRound = currentGame.round + 1;

        if (nextRound <= 4) {
            // Same region, next round, slot is ceil(currentSlot / 2)
            const nextSlot = Math.ceil(currentGame.bracket_slot / 2);
            return games.find(g =>
                g.region === currentGame.region &&
                g.round === nextRound &&
                g.bracket_slot === nextSlot
            ) || null;
        } else if (nextRound === 5) {
            // Final Four — need to match by region pair
            // South/East → one FF game, Midwest/West → other FF game
            return games.find(g => g.round === 5) || null; // simplified
        }
        return null;
    };

    // For display: augment games with user's picks cascaded in as team names
    const getDisplayGame = (game) => {
        if (game.round === 1) return game;

        let homeTeam = game.home_team;
        let awayTeam = game.away_team;
        let homeSeed = game.home_seed;
        let awaySeed = game.away_seed;
        let homeLogo = game.home_logo;
        let awayLogo = game.away_logo;

        const resolveTeam = (feederGame, pickedTeam) => {
            if (!feederGame || !pickedTeam) return {};
            // Find the team's seed and logo from the feeder game
            if (feederGame.home_team === pickedTeam) {
                return { seed: feederGame.home_seed, logo: feederGame.home_logo };
            }
            if (feederGame.away_team === pickedTeam) {
                return { seed: feederGame.away_seed, logo: feederGame.away_logo };
            }
            // Team not directly in feeder — recurse to find it deeper
            const deepFeederHome = getFeederGame(feederGame, "home");
            const deepFeederAway = getFeederGame(feederGame, "away");
            const fromHome = resolveTeam(deepFeederHome, pickedTeam);
            if (fromHome.logo) return fromHome;
            return resolveTeam(deepFeederAway, pickedTeam);
        };

        if (homeTeam === "TBD" || !homeTeam) {
            const feeder = getFeederGame(game, "home");
            if (feeder) {
                const picked = picks[feeder.id];
                if (picked) {
                    homeTeam = picked;
                    const { seed, logo } = resolveTeam(feeder, picked);
                    homeSeed = seed || null;
                    homeLogo = logo || null;
                }
            }
        }

        if (awayTeam === "TBD" || !awayTeam) {
            const feeder = getFeederGame(game, "away");
            if (feeder) {
                const picked = picks[feeder.id];
                if (picked) {
                    awayTeam = picked;
                    const { seed, logo } = resolveTeam(feeder, picked);
                    awaySeed = seed || null;
                    awayLogo = logo || null;
                }
            }
        }

        return { ...game, home_team: homeTeam, away_team: awayTeam, home_seed: homeSeed, away_seed: awaySeed, home_logo: homeLogo, away_logo: awayLogo };
    };

    const getFeederGame = (game, side) => {
        const prevRound = game.round - 1;
        if (prevRound < 1) return null;
        if (!game.bracket_slot) return null;

        const slot1 = (game.bracket_slot - 1) * 2 + 1;
        const slot2 = (game.bracket_slot - 1) * 2 + 2;

        // Final Four feeders are Elite 8 winners — matched by region pair
        if (game.round === 5) {
            // FF slot 1 = South + East Elite 8 winners
            // FF slot 2 = Midwest + West Elite 8 winners
            const regionPair = game.bracket_slot === 1
                ? ["South", "East"]
                : ["Midwest", "West"];

            const feeders = games.filter(g =>
                g.round === 4 &&
                regionPair.includes(g.region)
            ).sort((a, b) => {
                // South/Midwest = home side, East/West = away side
                const order = { South: 1, Midwest: 1, East: 0, West: 0 };
                return order[a.region] - order[b.region];
            });

            return feeders[side === "home" ? 0 : 1] || null;
        }
        // Championship feeders are Final Four games — no region filter
        if (game.round === 6) {
            const feeders = games.filter(g =>
                g.round === 5 &&
                (g.bracket_slot === slot1 || g.bracket_slot === slot2)
            );
            return feeders[side === "home" ? 1 : 0] || null;
        }

        // For rounds 2-4, use region
        let region = game.region;
        if (!region && prevRound >= 1) {
            const candidates = games.filter(g =>
                g.round === prevRound &&
                (g.bracket_slot === slot1 || g.bracket_slot === slot2)
            );
            const withPick = candidates.find(g => picks[g.id]);
            if (withPick) region = withPick.region;
            else region = candidates[0]?.region;
        }

        if (!region) return null;

        const feeders = games.filter(g =>
            g.region === region &&
            g.round === prevRound &&
            (g.bracket_slot === slot1 || g.bracket_slot === slot2)
        );
        return feeders[side === "home" ? 1 : 0] || null;
    };

    const tabGames = activeTab === "Final Four"
        ? games.filter(g => g.round >= 5)
        : games.filter(g => g.region === activeTab);

    const byRound = {};
    for (const g of tabGames) {
        if (!byRound[g.round]) byRound[g.round] = [];
        byRound[g.round].push(g);
    }

    const totalGames = games.length;
    const pickedCount = Object.keys(picks).length;
    const champion = (() => {
        const champGame = games.find(g => g.round === 6);
        return champGame ? picks[champGame.id] : null;
    })();

    return (
        <div style={{ paddingTop: 68, paddingBottom: 80, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
            <Toaster />

            {/* Header */}
            <div style={{
                background: `linear-gradient(135deg, ${BLUE} 0%, #030831 100%)`,
                color: "white", padding: "20px 24px", marginBottom: 20,
            }}>
                <div style={{ maxWidth: 1600, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                    <div>
                        <h2 style={{ margin: 0, color: GOLD, fontWeight: 900 }}>📝 My Bracket</h2>
                        {isLocked
                            ? <div style={{ marginTop: 6, fontSize: 13, color: "#fca5a5" }}>🔒 Bracket locked — tournament has started</div>
                            : <div style={{ marginTop: 6, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>Locks March 19 at 11:10 AM CT</div>
                        }
                    </div>

                    {/* Auth / user bar always in header */}
                    {!authenticated ? (
                        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                            <select value={user} onChange={e => setUser(e.target.value)}
                                style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #ccc", fontSize: 13 }}>
                                <option value="SELECT YOUR NAME" disabled>SELECT YOUR NAME</option>
                                {users.map(u => <option key={u.name} value={u.name}>{u.name}</option>)}
                            </select>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                                placeholder="Password" onKeyDown={e => e.key === "Enter" && verify()}
                                style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #ccc", fontSize: 13, minWidth: 120 }} />
                            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "white", cursor: "pointer" }}>
                                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
                                Remember me
                            </label>
                            <button onClick={verify}
                                style={{ padding: "6px 14px", borderRadius: 6, backgroundColor: GOLD, color: BLUE, border: "none", fontWeight: 700, cursor: "pointer" }}>
                                Verify
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                            <span style={{ fontWeight: 700, color: GOLD }}>{user}</span>
                            {champion && <span style={{ fontSize: 13, color: GOLD, fontWeight: 700 }}>🏆 {champion}</span>}
                            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{pickedCount}/{totalGames} picked</span>
                            {!isLocked && (
                                <button onClick={handleSave} disabled={saving}
                                    style={{ padding: "6px 16px", borderRadius: 6, backgroundColor: "#16a34a", color: "white", border: "none", fontWeight: 600, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
                                    {saving ? "Saving..." : "💾 Save"}
                                </button>
                            )}
                            <button onClick={logout}
                                style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer", color: "white", backgroundColor: "transparent" }}>
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* DESKTOP BRACKET */}
            <div className="bracket-desktop" style={{ overflowX: "hidden", padding: "0 8px" }}>
                {!authenticated ? (
                    <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>
                        Verify your identity above to make picks.
                    </div>
                ) : loading ? (
                    <div style={{ textAlign: "center", padding: 60, color: BLUE }}>Loading your bracket...</div>
                ) : (
                    <BracketScaler>
                        <div style={{
                            display: "flex", gap: 12, alignItems: "flex-start",
                            width: 1600,
                        }}>
                            {/* Left: South + East */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 40, flex: 1 }}>
                                <BracketRegion region="South" games={gamesByRegion("South")} userPicks={picks} onPick={isLocked ? null : handlePick} readonly={isLocked} getDisplayGame={getDisplayGame} />
                                <BracketRegion region="East" games={gamesByRegion("East")} userPicks={picks} onPick={isLocked ? null : handlePick} readonly={isLocked} getDisplayGame={getDisplayGame} />
                            </div>
                            {/* Center: Final Four + Championship */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: 200, flexShrink: 0, paddingTop: 40 }}>
                                <div style={{ fontSize: 12, fontWeight: 800, color: BLUE, textTransform: "uppercase", letterSpacing: "1px", borderBottom: `2px solid ${GOLD}`, paddingBottom: 4, width: "100%", textAlign: "center", marginBottom: 8 }}>Final Four</div>
                                {finalFourGames.map(g => (
                                    <BracketGame key={g.id} game={getDisplayGame(g)} userPick={picks[g.id]} onPick={isLocked ? null : handlePick} readonly={isLocked} />
                                ))}
                                <div style={{ fontSize: 12, fontWeight: 800, color: GOLD, textTransform: "uppercase", letterSpacing: "1px", borderBottom: `2px solid ${GOLD}`, paddingBottom: 4, width: "100%", textAlign: "center", marginTop: 8 }}>🏆 Championship</div>
                                {championshipGame && (
                                    <BracketGame game={getDisplayGame(championshipGame)} userPick={picks[championshipGame.id]} onPick={isLocked ? null : handlePick} readonly={isLocked} />
                                )}
                            </div>
                            {/* Right: Midwest + West */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 40, flex: 1 }}>
                                <BracketRegion region="Midwest" games={gamesByRegion("Midwest")} userPicks={picks} onPick={isLocked ? null : handlePick} readonly={isLocked} flipped={true} getDisplayGame={getDisplayGame} />
                                <BracketRegion region="West" games={gamesByRegion("West")} userPicks={picks} onPick={isLocked ? null : handlePick} readonly={isLocked} flipped={true} getDisplayGame={getDisplayGame} />
                            </div>
                        </div>
                    </BracketScaler>
                )}
            </div>

            {/* MOBILE — tabs */}
            <div className="bracket-mobile" style={{ padding: "0 12px" }}>
                {!authenticated ? (
                    <div style={{ textAlign: "center", padding: 40, color: "#6b7280" }}>
                        Verify your identity above to make picks.
                    </div>
                ) : loading ? (
                    <p>Loading your bracket...</p>
                ) : (
                    <>
                        {/* Tab bar */}
                        <div style={{ display: "flex", overflowX: "auto", gap: 4, marginBottom: 16 }}>
                            {TABS.map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                                    padding: "6px 14px", borderRadius: 20, border: "none",
                                    fontWeight: 700, fontSize: 12, whiteSpace: "nowrap", cursor: "pointer",
                                    backgroundColor: activeTab === tab ? BLUE : "#e5e7eb",
                                    color: activeTab === tab ? "white" : "#374151",
                                }}>{tab}</button>
                            ))}
                        </div>

                        {/* Games by round */}
                        {Object.keys(byRound).sort((a, b) => a - b).map(round => (
                            <div key={round} style={{ marginBottom: 24 }}>
                                <div style={{
                                    fontSize: 12, fontWeight: 800, color: BLUE,
                                    textTransform: "uppercase", letterSpacing: "0.5px",
                                    marginBottom: 8, paddingBottom: 4,
                                    borderBottom: `2px solid ${GOLD}`,
                                }}>{ROUND_LABELS[round]}</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {byRound[round]
                                        .sort((a, b) => a.bracket_slot - b.bracket_slot)
                                        .map(game => (
                                            <BracketGame
                                                key={game.id}
                                                game={getDisplayGame(game)}
                                                userPick={picks[game.id]}
                                                onPick={isLocked ? null : handlePick}
                                                readonly={isLocked}
                                            />
                                        ))}
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}

function BracketScaler({ children }) {
    const [scale, setScale] = useState(1);
    const containerRef = React.useRef(null);

    useEffect(() => {
        const update = () => {
            const available = window.innerWidth - 32; // 16px padding each side
            const contentWidth = 1600;
            setScale(Math.min(1, available / contentWidth));
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    return (
        <div ref={containerRef} style={{ width: "100%", overflow: "hidden" }}>
            <div style={{
                width: 1600,
                transformOrigin: "top left",
                transform: `scale(${scale})`,
                height: `calc(100% * ${scale})`,  // prevents clipping
            }}>
                {children}
            </div>
        </div>
    );
}