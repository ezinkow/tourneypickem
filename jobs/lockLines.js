const { Users, Picks, Games } = require("../models");
const { Op } = require("sequelize");

const lockLines = async () => {
    const now = new Date();
    
    // 1. Find Games that have started in the last 24 hours
    const startedGames = await Games.findAll({
        where: {
            game_date: { [Op.lt]: now }
        }
    });

    const allUsers = await Users.findAll();

    for (const game of startedGames) {
        for (const user of allUsers) {
            // 2. Check if a pick exists for this user/game combo
            const existingPick = await Picks.findOne({
                where: { game_id: game.id, name: user.name }
            });

            // 3. If no pick, create the "Missed Pick" entry
            if (!existingPick) {
                await Picks.create({
                    name: user.name,
                    game_id: game.id,
                    pick: game.underdog, // Default to Underdog
                    game_date: game.game_date,
                    missed_pick_flag: true,
                    game_locked_time: game.game_date
                });
                console.log(`Assigned missed pick to ${user.name} for game ${game.id}`);
            }
        }
    }

    async function lockLines() {
    const now = new Date();

    const games = await Games.findAll({
        where: {
            line_locked: null
        }
    });

    for (const game of games) {
        const gameStart = new Date(game.game_date);
        const lockThreshold = new Date(gameStart.getTime() - 60 * 60 * 1000);

        if (now >= lockThreshold && game.favorite) {

            await game.update({
                line_locked: game.favorite ? game.line_locked ?? game.line_locked : null,
                locked_favorite: game.favorite,
                locked_underdog: game.underdog,
                locked_fav_logo: game.fav_logo,
                locked_dog_logo: game.dog_logo,
                line_locked_time: now
            });

            console.log(`🔒 Locked line for ${game.id}`);
        }
    }
}

};

module.exports = lockLines;