const envFile = process.env.ENV_FILE || (process.env.NODE_ENV === 'production' ? '.env.prod' : '.env')
require('dotenv').config({ path: envFile })

module.exports = {
    DATABASE_URL: process.env.DATABASE_URL,
    PORT: process.env.PORT || 3001,
    SECRET: process.env.SECRET
}