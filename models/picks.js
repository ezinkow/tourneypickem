module.exports = (sequelize, DataTypes) => {
    const Picks = sequelize.define('Picks', {
        name: {
            type: DataTypes.STRING(255), // Explicit length for Indexing
            allowNull: false
        },
        game_id: {
            type: DataTypes.STRING(255), // Explicit length for Indexing
            allowNull: false
        },
        pick: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        game_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        missed_pick_flag: {
            type: DataTypes.BOOLEAN,
            defaultValue: false // New Boolean Flag
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['name', 'game_id'] // Composite Unique Key
            }
        ]
    });

    return Picks;
};