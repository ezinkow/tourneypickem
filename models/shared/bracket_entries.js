module.exports = function (sequelize, DataTypes) {
    const UsersBracket = sequelize.define("UsersBracket", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        real_name: { type: DataTypes.STRING, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: true },
        phone: { type: DataTypes.STRING, allowNull: true },
        paid: { type: DataTypes.STRING, allowNull: true },
    }, {
        tableName: "bracket_users",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: false,
    });
    return UsersBracket;
};