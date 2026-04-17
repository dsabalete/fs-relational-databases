const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const { initializeModels } = require('./models')

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map(err => err.message)
        return response.status(400).json({ error: messages })
    } else if (error.name === 'SequelizeUniqueConstraintError') {
        const messages = error.errors.map(err => err.message)
        return response.status(400).json({ error: messages })
    } else if (error.name === 'SyntaxError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const resetRouter = require('./controllers/reset')

app.use(express.json())

app.get('/', (request, response) => {
    response.sendStatus(200)
})

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/reset', resetRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

const start = async () => {
    await connectToDatabase()

    // Sync models with the database after connection is established
    await initializeModels()

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

start()
