import db from "../models";

export const lockGamesAndAssignMissedPicks = async () => {
  const now = new Date();

  const games = await db.Game.findAll({
    where: {
      status: STATUS_LIVE,
      game_lock: { [db.Sequelize.Op.lt]: now }
    }
  });

  for (const game of games) {
    const names = await db.Names.findAll();

    for (const name of names) {
      const existingPick = await db.Picks.findOne({
        where: { game_id: game.id, name_id: name.id }
      });

      if (!existingPick) {
        await db.Pick.create({
          game_id: game.id,
          name_id: name.id,
          picked_team: game.underdog,
          missed_pick_flag: true
        });
      }
    }

    game.locked = true;
    await game.save();
  }
};