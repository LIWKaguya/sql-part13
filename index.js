require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express');
const app = express();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  timestamps: false,
  modelName: "blog"
})

Blog.sync();

app.get('/api/blogs', async (_, res) => {
  const blogs = await Blog.findAll();
  return res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
  try {
    const {title, author, url, likes} = req.body
    const blog = await Blog.create({title, author, url, likes})
    return res.json(blog)
  } catch (error) {
    res.status(400).json({ error })
  }
})

app.delete('/api/blogs/:id', async (req, res) => {
  try {
    await Blog.destroy({
      where: {
        id: req.params.id
      }
    })
    return res.json(204)
  } catch (error) {
    res.status(400).json({ error })
  }
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})