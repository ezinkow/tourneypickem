module.exports = function (sequelize, DataTypes) {
    const TokensPickem = sequelize.define("TokensPickem", {
        token: { type: DataTypes.STRING(64), primaryKey: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        expires: { type: DataTypes.DATE, allowNull: false },
    }, { tableName: "pickem_tokens", timestamps: false });
    return TokensPickem;
};