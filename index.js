require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')
const app = express()

app.use(express.json())

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
})

class Note extends Model { }

Note.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    important: {
        type: DataTypes.BOOLEAN
    },
    date: {
        type: DataTypes.DATE
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'note'
})

app.get('/api/notes', async (req, res) => {
    const notes = await Note.findAll()
    res.json(notes)
})

app.get('/api/notes/:id', async (req, res) => {
    const note = await Note.findByPk(req.params.id)
    if (note) {
        res.json(note)
    } else {
        res.status(404).end()
    }
})

app.post('/api/notes', async (req, res) => {
    console.log(req.body)
    try {
        const note = await Note.create({ ...req.body, date: new Date() })

        // optionally, we could also do:
        // const note = Note.build(req.body)
        // note.important = true
        // await note.save()

        res.json(note)

    } catch (error) {
        return res.status(400).json({ error })
    }
})

app.put('/api/notes/:id', async (req, res) => {
    const note = await Note.findByPk(req.params.id)
    if (note) {
        note.content = req.body.content || note.content
        note.important = req.body.important
        await note.save()
        res.json(note)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/notes/:id', async (req, res) => {
    const note = await Note.findByPk(req.params.id)
    if (note) {
        await note.destroy()
        res.status(204).end()
    } else {
        res.status(404).end()
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})