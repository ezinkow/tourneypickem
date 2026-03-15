module.exports = function (sequelize, DataTypes) {
    const SquaresGrid = sequelize.define("SquaresGrid", {
        square_id: { type: DataTypes.INTEGER, primaryKey: true },
        owner_name: { type: DataTypes.STRING, allowNull: true },
        rowNumber: { type: DataTypes.INTEGER, allowNull: true },
        colNumber: { type: DataTypes.INTEGER, allowNull: true },
        createdAt: { type: DataTypes.DATE, allowNull: true },
    }, {
        tableName: "squares_grid",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: false,
    });
    return SquaresGrid;
};