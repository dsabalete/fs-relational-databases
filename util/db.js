const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')

const connectionString = DATABASE_URL || ''
const isLocalDatabase = /localhost|127\.0\.0\.1/.test(connectionString) || /sslmode=disable/i.test(connectionString)

const sequelizeOptions = isLocalDatabase
    ? {}
    : {
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }

const sequelize = new Sequelize(DATABASE_URL, sequelizeOptions)

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate()
        console.log('connected to the database')
    } catch (err) {
        console.log('failed to connect to the database')
        return process.exit(1)
    }

    return null
}

module.exports = { connectToDatabase, sequelize }