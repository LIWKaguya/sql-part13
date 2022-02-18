require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express');
const app = express();
app.use(express.json())

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
    const {title, author, url, likes} = req.body
    console.log(req.body);
    const blog = await Blog.create({author, url, title, likes})
    return res.json(blog)
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