require('dotenv').config()

module.exports = {
  development: {
    username: process.env.MYSQL_DB_USER,
    password: process.env.MYSQL_DB_PASSWORD,
    database: process.env.MYSQL_DB_DATABASE,
    host: process.env.MYSQL_DB_HOST,
    port: 3306,
    dialect: 'mysql',
    dialectOptions: {
      bigNumberStrings: true,
    },
    pool: {
      max: 50, // maximum number of connections in the pool
      min: 10, // minimum number of connections in the pool
      acquire: 30000, // maximum time, in milliseconds, that a connection can be idle before being released
      idle: 10000, // maximum time, in milliseconds, that a connection can be idle before being closed
    },
  }
};