require('dotenv').config()
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
})

const main = async () => {
    try {
        const blogs = await sequelize.query('SELECT * FROM blogs', { type: Sequelize.QueryTypes.SELECT })
        console.log(blogs.map(b => `${b.author}: '${b.title}', ${b.likes} likes\n`).join(''))
        sequelize.close()
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}

main()