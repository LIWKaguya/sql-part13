const router = require('express').Router()
const bcrypt = require('bcryptjs');

const { User, Blog } = require('../models')

const userFinder = async (req, _, next) => {
    req.user = await User.findOne({
        where: {
            username: req.params.username
        }
    })
    next()
}

router.get('/', async (_, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ["UserId"] },
    },
  });
  res.json(users)
})

router.post('/', async (req, res) => {
    const {name, username, password} = req.body

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = await User.create({username, name, passwordHash})
    return res.json(newUser)
})

router.get("/:id", async (req, res) => {
  let where = {};

  if (req.query.read) {
    where = {
      read: req.query.read,
    };
  }

  const user = await User.findByPk(req.params.id, {
    attributes: ['name', 'username'],
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['createdAt', 'updatedAt', 'userId'] },
        through: {
          attributes: ['read', 'id'],
          where,
        },
      },
    ],
  });
  
  res.json(user);
});

router.put('/:username', userFinder, async (req, res) => {
  req.user.username = req.body.username
  await req.user.save();
  return res.json(req.user);
})

module.exports = router