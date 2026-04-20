const { NbaPicks, NbaSeries, NbaEntries, NbaTiebreaker } = require("../../models");

module.exports = function (app) {
    // GET /api/nba/standings
    app.get("/api/nba/standings", async (req, res) => {
        try {
            // 1. Fetch everything in parallel for speed
            const [entries, series, tiebreakers, allPicks] = await Promise.all([
                NbaEntries.findAll(),
                NbaSeries.findAll(),
                NbaTiebreaker.findAll(),
                NbaPicks.findAll()
            ]);

            // 2. Map data for O(1) lookup
            const seriesMap = {};
            series.forEach(s => seriesMap[s.id] = s);

            const tbMap = {};
            tiebreakers.forEach(t => tbMap[t.user_id] = t.total_points);

            const picksByUser = {};
            allPicks.forEach(p => {
                if (!picksByUser[p.user_id]) picksByUser[p.user_id] = [];
                picksByUser[p.user_id].push(p);
            });

            // 3. Define the absolute ceiling (32*2 + 24*2 + 16*2 + 8*2)
            const TOTAL_TOURNAMENT_MAX = 160;

            const standings = entries.map(entry => {
                const picks = picksByUser[entry.user_id] || [];
                let points = 0;
                let correct_series = 0;
                let correct_lengths = 0;
                let potential_lost = 0;

                // Loop through picks to see what has been earned or lost
                for (const pick of picks) {
                    const s = seriesMap[pick.series_id];
                    if (!s) continue;

                    const base = pick.confidence;
                    const maxForThisSeries = base * 2;

                    if (s.winner) {
                        // SERIES IS OVER
                        if (pick.pick === s.winner) {
                            // User picked right winner
                            const isPerfect = pick.series_length_guess === s.series_length;
                            const earned = isPerfect ? maxForThisSeries : base;

                            points += earned;
                            correct_series += 1;
                            if (isPerfect) correct_lengths += 1;

                            // If they got the winner right but missed the length, 
                            // they "lost" the bonus half of the potential points
                            if (!isPerfect) {
                                potential_lost += (maxForThisSeries - base);
                            }
                        } else {
                            // User picked wrong winner - they lost all potential points here
                            potential_lost += maxForThisSeries;
                        }
                    } else {
                        // SERIES IN PROGRESS
                        // Check if their picked team is already eliminated (4 losses)
                        const homeLost = s.away_wins === 4;
                        const awayLost = s.home_wins === 4;
                        const pickedTeamLost = (pick.pick === s.home_team && homeLost) ||
                            (pick.pick === s.away_team && awayLost);

                        if (pickedTeamLost) {
                            potential_lost += maxForThisSeries;
                        }
                    }
                }

                return {
                    entry_name: entry.entry_name,
                    user_id: entry.user_id,
                    points,
                    correct_series,
                    correct_lengths,
                    // The Max is the total ceiling minus points no longer obtainable
                    max_possible: TOTAL_TOURNAMENT_MAX - potential_lost,
                    tiebreaker: tbMap[entry.user_id] ?? null,
                };
            });

            // 4. Sort: Points -> Correct Series -> Alphabetical
            standings.sort((a, b) =>
                b.points - a.points ||
                b.correct_series - a.correct_series ||
                a.entry_name.localeCompare(b.entry_name)
            );

            // 5. Assign Ranks (handle ties)
            let rank = 1;
            for (let i = 0; i < standings.length; i++) {
                if (i > 0 && standings[i].points < standings[i - 1].points) rank = i + 1;
                standings[i].rank = rank;
            }

            res.json(standings);
        } catch (err) {
            console.error("[Standings API Error]:", err);
            res.status(500).json({ error: "Failed to calculate standings" });
        }
    });
};