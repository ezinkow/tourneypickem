module.exports = function (sequelize, DataTypes) {
    const Answered = sequelize.define("Answered", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        question: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        answer: {
            type: DataTypes.TEXT,
        },
        timeWasted: {
            type: DataTypes.TEXT,
        }
    });

    return Answered;
};
