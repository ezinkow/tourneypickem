module.exports = function (sequelize, DataTypes) {
    const Statement = sequelize.define("Statement", {
        when: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        statement: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [1]
            }
        }
    });

    return Statement;
};
