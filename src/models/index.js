const db = require('../config/database');
const user = require('./user.model')
const categories = require('./category.model')
const products = require('./product.model')
const image = require('./image.model')

db.user = (user)(db.sequelize, db.Sequelize);
db.category = (categories)(db.sequelize, db.Sequelize);
db.product = (products)(db.sequelize, db.Sequelize);
db.image = (image)(db.sequelize, db.Sequelize);

db.product.hasMany(db.image, {
    foreignKey: 'product_id'
})

db.category.hasMany(db.product,  {
    foreignKey: 'category_id'
})

db.user.hasMany(db.product, {
    foreignKey: 'user_id'
})

module.exports = db;