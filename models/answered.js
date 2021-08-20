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
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        answer: {
            type: DataTypes.STRING,
        },
        timeWasted: {
            type: DataTypes.STRING,
        }
    });

    return Answered;
};
