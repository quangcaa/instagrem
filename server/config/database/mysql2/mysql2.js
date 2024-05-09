const { loggerMYSQL } = require('../../../utils/winston')
require('dotenv').config()

module.exports = {
  development: {
    username: process.env.MYSQL_DB_USER,
    password: process.env.MYSQL_DB_PASSWORD,
    database: process.env.MYSQL_DB_DATABASE,
    host: process.env.MYSQL_DB_HOST,
    port: 3306,
    dialect: 'mysql',
    logging: (msg) => loggerMYSQL.info(`Sequelize: ${msg}`),
    dialectOptions: {
      bigNumberStrings: true,
    },
    pool: {
      max: 50,
      min: 10,
      acquire: 30000,
      idle: 10000,
    },
  },
  replicaSet: {
    dialect: 'mysql',
    logging: (msg) => loggerMYSQL.debug(`Sequelize: ${msg}`),
    replication: {
      read: [
        {
          host: 'localhost',
          port: 3309,
          username: 'user',
          password: 'pass',
          database: 'threads',
          pool: {
            max: 50,
            min: 10,
            acquire: 30000,
            idle: 10000,
          },
        },
        {
          host: 'localhost',
          port: 3310,
          username: 'user',
          password: 'pass',
          database: 'threads',
          pool: {
            max: 50,
            min: 10,
            acquire: 30000,
            idle: 10000,
          },
        },
      ],
      write: {
        host: 'localhost',
        port: 3308,
        username: 'user',
        password: 'pass',
        database: 'threads',
        pool: {
          max: 50,
          min: 10,
          acquire: 30000,
          idle: 10000,
        },
      },
    },
    define: {},
  }
};