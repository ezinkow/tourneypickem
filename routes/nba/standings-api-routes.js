const { NbaPicks, NbaSeries, NbaEntries, NbaTiebreaker } = require("../../models");

module.exports = function (app) {

    // GET /api/nba/standings
    app.get("/api/nba/standings", async (req, res) => {
        try {
            const entries   = await NbaEntries.findAll();
            const series    = await NbaSeries.findAll();
            const tiebreakers = await NbaTiebreaker.findAll();

            const seriesMap = {};
            for (const s of series) seriesMap[s.id] = s;

            const tbMap = {};
            for (const t of tiebreakers) tbMap[t.user_id] = t.total_points;

            const standings = [];

            for (const entry of entries) {
                const picks = await NbaPicks.findAll({ where: { user_id: entry.user_id } });

                let points         = 0;
                let correct_series = 0;
                let correct_lengths = 0;
                let max_possible   = 0;

                for (const pick of picks) {
                    const s = seriesMap[pick.series_id];
                    if (!s) continue;

                    const base = pick.confidence;

                    if (s.winner) {
                        // Series is final — score it
                        if (pick.pick === s.winner) {
                            const earned = pick.series_length_guess === s.series_length
                                ? base * 2
                                : base;
                            points += earned;
                            correct_series += 1;
                            if (pick.series_length_guess === s.series_length) {
                                correct_lengths += 1;
                            }
                        }
                        // Wrong pick — 0 points, nothing to add to max_possible
                    } else {
                        // Series still in progress — add to max possible (optimistic: correct + length bonus)
                        max_possible += base * 2;
                    }
                }

                standings.push({
                    entry_name:      entry.entry_name,
                    user_id:         entry.user_id,
                    points,
                    correct_series,
                    correct_lengths,
                    max_possible:    points + max_possible,
                    tiebreaker:      tbMap[entry.user_id] ?? null,
                });
            }

            // Sort: points desc, then tiebreaker proximity (handled client-side if Finals active)
            standings.sort((a, b) => b.points - a.points || b.correct_series - a.correct_series);

            // Add rank (handle ties)
            let rank = 1;
            for (let i = 0; i < standings.length; i++) {
                if (i > 0 && standings[i].points < standings[i - 1].points) rank = i + 1;
                standings[i].rank = rank;
            }

            res.json(standings);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to load standings" });
        }
    });
};