const db = require('../config/database');
const users = require('./user.model')
const categories = require('./category.model')
const products = require('./product.model')
const image = require('./image.model')

db.user = (categories)(db.sequelize, db.Sequelize);
db.user = (products)(db.sequelize, db.Sequelize);
db.user = (image)(db.sequelize, db.Sequelize);

module.exports = db;