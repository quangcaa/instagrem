const cron = require('node-cron')
const shell = require('shelljs')
const moment = require('moment-timezone')
require('dotenv').config()

moment.tz.setDefault('Asia/Ho_Chi_Minh')

function startBackup() {

  cron.schedule('*/5 * * * *', function () {
    const currentTime = moment().format()
    console.log(`Backup started at ${currentTime}\n`)

    // MongoDB Atlas Backup
    if (shell.exec(`mongodump --uri="mongodb+srv://quangcaa:xQkQ6EO0FNSbWddg@quangcaa.9ftudqn.mongodb.net/" --out ${process.env.MONGO_BACKUP_DIR}`).code !== 0) {
      console.error('MongoDB backup failed')
      shell.exit(1)
    } else {
      console.log('MongoDB backup successful') 
    }

    // MySQL Backup 
    shell.env['MYSQL_PWD'] = process.env.MYSQL_DB_PASSWORD
    if (shell.exec(`mysqldump -u ${process.env.MYSQL_DB_USER} ${process.env.MYSQL_DB_DATABASE} > ${process.env.MYSQL_BACKUP_DIR}/mysql.sql`).code !== 0) {
      console.error('MySQL backup failed')
      shell.exit(1)
    } else {
      console.log('MySQL backup successful')
    }
  })
} 

module.exports = startBackup 