module.exports = function (sequelize, DataTypes) {
    const Query = sequelize.define("Query", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        question: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        answer: {
            type: DataTypes.STRING,
        },
        time_wasted: {
            type: DataTypes.STRING,
        }
    });

    return Query;
};
