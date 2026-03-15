const { SquaresGrid } = require("../../models/squares");
const { GamesBracket } = require("../../models/bracket");

const LOCK_TIME = new Date("2026-03-19T11:10:00-05:00");

const ROUND_PAYOUTS = { 1: 12.5, 2: 25, 3: 50, 4: 100, 5: 200, 6: 500 };

module.exports = function (app) {

    // Get full grid
    app.get("/api/squares/grid", async (req, res) => {
        try {
            const squares = await SquaresGrid.findAll({
                order: [["square_id", "ASC"]]
            });
            res.json(squares);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to load grid" });
        }
    });

    // Claim a square
    app.post("/api/squares/claim", async (req, res) => {
        try {
            if (new Date() >= LOCK_TIME) {
                return res.status(403).json({ error: "Squares are locked" });
            }
            const { square_id, owner_name } = req.body;
            if (!owner_name) return res.status(400).json({ error: "Name required" });

            const square = await SquaresGrid.findOne({ where: { square_id } });
            if (!square) return res.status(404).json({ error: "Square not found" });
            if (square.owner_name) return res.status(409).json({ error: "Square already claimed" });

            await square.update({ owner_name });
            res.json({ success: true, square_id, owner_name });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Claim failed" });
        }
    });

    // Unclaim a square
    app.post("/api/squares/unclaim", async (req, res) => {
        try {
            if (new Date() >= LOCK_TIME) {
                return res.status(403).json({ error: "Squares are locked" });
            }
            const { square_id, owner_name } = req.body;
            const square = await SquaresGrid.findOne({ where: { square_id } });
            if (!square) return res.status(404).json({ error: "Square not found" });
            if (square.owner_name !== owner_name) {
                return res.status(403).json({ error: "You can only unclaim your own squares" });
            }
            await square.update({ owner_name: null });
            res.json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Unclaim failed" });
        }
    });

    // Results — match final games to winning squares
    app.get("/api/squares/results", async (req, res) => {
        try {
            const games = await GamesBracket.findAll({
                where: { status: "STATUS_FINAL" },
                order: [["round", "ASC"], ["bracket_slot", "ASC"]]
            });
            const squares = await SquaresGrid.findAll();
            const squareMap = {};
            for (const s of squares) {
                if (s.rowNumber !== null && s.colNumber !== null) {
                    squareMap[`${s.colNumber}-${s.rowNumber}`] = s;
                }
            }

            const results = games.map(game => {
                const winnerScore = game.winner === game.home_team
                    ? game.home_score
                    : game.away_score;
                const loserScore = game.winner === game.home_team
                    ? game.away_score
                    : game.home_score;

                const winDigit = winnerScore % 10;
                const loseDigit = loserScore % 10;
                const key = `${winDigit}-${loseDigit}`;
                const square = squareMap[key];
                const payout = ROUND_PAYOUTS[game.round] || 0;

                return {
                    game_id: game.id,
                    round: game.round,
                    round_label: game.round_label,
                    home_team: game.home_team,
                    away_team: game.away_team,
                    home_score: game.home_score,
                    away_score: game.away_score,
                    winner: game.winner,
                    win_digit: winDigit,
                    lose_digit: loseDigit,
                    square_id: square?.square_id ?? null,
                    owner_name: square?.owner_name ?? null,
                    payout,
                };
            });

            res.json(results);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to load results" });
        }
    });

    app.get("/api/squares/my-numbers", async (req, res) => {
        try {
            const squares = await SquaresGrid.findAll({
                where: { owner_name: { [require("sequelize").Op.not]: null } },
                order: [["square_id", "ASC"]]
            });

            const grouped = {};
            for (const s of squares) {
                if (!grouped[s.owner_name]) grouped[s.owner_name] = [];
                // Only include if numbers have been assigned
                if (s.rowNumber !== null && s.colNumber !== null) {
                    grouped[s.owner_name].push(`${s.colNumber}${s.rowNumber}`);
                } else {
                    grouped[s.owner_name].push(`#${s.square_id}`); // fallback if not yet assigned
                }
            }

            res.json(grouped);
        } catch (err) {
            res.status(500).json({ error: "Failed" });
        }
    });
};