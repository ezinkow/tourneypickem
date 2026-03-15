module.exports = function (sequelize, DataTypes) {
    const TokensBracket = sequelize.define("TokensBracket", {
        token: { type: DataTypes.STRING(64), primaryKey: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        expires: { type: DataTypes.DATE, allowNull: false },
    }, { tableName: "bracket_tokens", timestamps: false });
    return TokensBracket;
};