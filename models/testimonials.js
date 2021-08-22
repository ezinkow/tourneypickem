module.exports = function (sequelize, DataTypes) {
    const Testimonial = sequelize.define("Testimonial", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        testimonial: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [1]
            }
        }
    });

    return Testimonial;
};
