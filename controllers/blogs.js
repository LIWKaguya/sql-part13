const router = require('express').Router()
const { Op } = require("sequelize");

const { Blog, User, Session } = require("../models");
const { SECRET } = require("../util/config");

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');
  req.token = null;

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7);
    const session = await Session.findOne({
      where: { token },
    });

    if (session) {
      req.token = token;
      req.decodedToken = jwt.verify(req.token, SECRET);
    } else return res.status(401).json({ error: 'token expired' });
  }

  if (!authorization || !req.decodedToken.id) {
    return res.status(401).json({ error: 'missing token' });
  }

  req.user = await User.findByPk(req.decodedToken.id);

  next();
};

const blogFinder = async (req, _, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

router.get("/", async (req, res) => {
    let where = {};
    if (req.query.search) {
      where = {
        [Op.or]: [
          {
            title: {
              [Op.substring]: req.query.search,
            },
          },
          {
            author: {
              [Op.substring]: req.query.search,
            },
          },
        ],
      };
    }
  
    const blogs = await Blog.findAll({
      attributes: { exclude: ["UserId"] },
      include: {
        model: User,
        attributes: ["name"],
      },
      where,
      order: [["likes", "DESC"]],
    });
    res.json(blogs);
});

router.get('/:id', blogFinder, async(req, res) => {
    if(req.blog) {
        res.json(req.blog)
    } else {
        res.status(404).end()
    }
})

router.post('/', async (req, res) => {
  const user = req.user;
  const blog = await Blog.create({ ...req.body, UserId: user.id });
  return res.json(blog);
})

router.delete('/:id', blogFinder, async (req, res) => {
  const user = req.user;
  if (user.id === req.blog.UserId) {
    await req.blog.destroy();
    res.status(204).end();
  } else {
    response.status(401).end();
  }
})

router.put('/:id', blogFinder, tokenExtractor, async (req, res) => {
  const user = req.user;
  if (user.id === req.blog.UserId) {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.json(req.blog);
  } else {
    response.status(401).end();
  }
})

module.exports = router