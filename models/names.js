module.exports = function (sequelize, DataTypes) {
    const Names = sequelize.define("Names", {
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        }, 
        paid: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        friendly_name: {
            type: DataTypes.TEXT,
            allowNull:true
        }
    });

    return Names;
};
