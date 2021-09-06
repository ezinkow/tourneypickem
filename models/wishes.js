module.exports = function (sequelize, DataTypes) {
    const Wish = sequelize.define("Wish", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        wish: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [1]
            }
        }
    });

    return Wish;
};
