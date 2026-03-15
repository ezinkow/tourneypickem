module.exports = function (sequelize, DataTypes) {
    const TokensSquares = sequelize.define("TokensSquares", {
        token: { type: DataTypes.STRING(64), primaryKey: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        expires: { type: DataTypes.DATE, allowNull: false },
    }, { tableName: "squares_tokens", timestamps: false });
    return TokensSquares;
};