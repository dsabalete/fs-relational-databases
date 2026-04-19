const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    if (!req.blog) {
        return res.status(404).end()
    }
    next()
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
        } catch {
            return res.status(401).json({ error: 'token invalid' })
        }
    } else {
        return res.status(401).json({ error: 'token missing' })
    }
    next()
}

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

module.exports = {
    tokenExtractor,
    errorHandler,
    unknownEndpoint,
    blogFinder
}
