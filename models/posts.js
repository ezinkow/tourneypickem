module.exports = function (sequelize, DataTypes) {
    const Comment = sequelize.define("Comment", {
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [1]
            }
        }
    });

    return Comment;
};
