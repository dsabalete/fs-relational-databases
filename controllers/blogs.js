const router = require('express').Router()
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
const { Blog, User } = require('../models')
const { SECRET } = require('../util/config')

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

router.get('/', async (req, res) => {
    const where = {}

    if (req.query.search) {
        where[Op.or] = [
            { title: { [Op.substring]: req.query.search } },
            { author: { [Op.substring]: req.query.search } }
        ]
    }

    const blogs = await Blog.findAll({
        attributes: { exclude: ['userId'] },
        include: {
            model: User,
            attributes: ['name']
        },
        where,
        order: [['likes', 'DESC']]
    })
    res.json(blogs)
})


router.post('/', tokenExtractor, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.decodedToken.id)
        if (!user) {
            return res.status(401).json({ error: 'user not found' })
        }

        const blog = await Blog.create({ ...req.body, userId: user.id })
        res.json(blog)
    } catch (error) {
        next(error)
    }
})

router.get('/:id', blogFinder, async (req, res) => {
    res.json(req.blog)
})

router.put('/:id', blogFinder, async (req, res, next) => {
    try {
        req.blog.likes = req.body.likes ?? req.blog.likes
        req.blog.title = req.body.title ?? req.blog.title
        req.blog.author = req.body.author ?? req.blog.author
        req.blog.url = req.body.url ?? req.blog.url
        await req.blog.save()
        res.json(req.blog)
    } catch (error) {
        next(error)
    }
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
    if (req.blog.userId !== req.decodedToken.id) {
        return res.status(401).json({ error: 'only creator can delete a blog' })
    }

    await req.blog.destroy()
    res.status(204).end()
})

module.exports = router