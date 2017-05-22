var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

if (env === 'production') {
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres'
	});
} else {
	sequelize = new Sequelize(undefined, undefined, undefined, {
		'dialect': 'sqlite',
	});
}

var db = {};

db.userinfo = sequelize.import(__dirname + '/models/userinfo.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
