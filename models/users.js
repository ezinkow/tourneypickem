module.exports = function (sequelize, DataTypes) {
    const Users = sequelize.define("Users", {
        real_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email_address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        paid: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    return Users;
};
