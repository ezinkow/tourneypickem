module.exports = function (sequelize, DataTypes) {
    const Users = sequelize.define("Users", {
        real_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email_address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email_opt_in: {
            type: DataTypes.STRING,
            allowNull: true
        },
        paid_commitment: {
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
