const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')
const { Umzug, SequelizeStorage } = require('umzug')

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
        await runMigrations()
        console.log('connected to the database')
    } catch (err) {
        console.log('failed to connect to the database')
        return process.exit(1)
    }

    return null
}

const migrationConf = {
    migrations: {
        glob: 'migrations/*.js',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console,
}

const runMigrations = async () => {
    const migrator = new Umzug(migrationConf)
    const migrations = await migrator.up()
    console.log('Migrations up to date', {
        files: migrations.map((mig) => mig.name),
    })
}

const rollbackMigration = async () => {
    await sequelize.authenticate()
    const migrator = new Umzug(migrationConf)
    await migrator.down()
}

module.exports = { connectToDatabase, sequelize, rollbackMigration }