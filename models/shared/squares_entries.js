module.exports = function (sequelize, DataTypes) {
    const UsersSquares = sequelize.define("UsersSquares", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
        email: { type: DataTypes.STRING, allowNull: true },
        password: { type: DataTypes.STRING, allowNull: true },
        phone: { type: DataTypes.STRING, allowNull: true },
        paid: { type: DataTypes.BOOLEAN, defaultValue: false },
    }, {
        tableName: "squares_users",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: false,
    });
    return UsersSquares;
};