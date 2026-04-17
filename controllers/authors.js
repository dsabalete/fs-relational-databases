const router = require('express').Router()
const { Blog } = require('../models')
const { sequelize } = require('../util/db')


router.get('/', async (req, res) => {
    const authors = await Blog.findAll({
        attributes: [
            'author',
            [sequelize.fn('COUNT', sequelize.col('id')), 'blogs'],
            [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
        ],
        group: ['author'],
        raw: true,
        order: [[sequelize.literal('likes'), 'DESC']]
    })
    res.json(authors)
})

module.exports = router