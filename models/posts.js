module.exports = function (sequelize, DataTypes) {
    const Post = sequelize.define("Post", {
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        post: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [1]
            }
        }
    });

    return Post;
};
