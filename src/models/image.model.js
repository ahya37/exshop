module.exports = (sequelize, Sequelize) => {
    const Image = sequelize.define('images', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        url_image: {
            type: Sequelize.STRING,
            allowNull: false
        }
    })

    return Image
}