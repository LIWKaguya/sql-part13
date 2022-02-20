const router = require('express').Router()
const bcrypt = require('bcryptjs');

const { User } = require('../models')

const userFinder = async (req, _, next) => {
    req.user = await User.findOne({
        where: {
            username: req.params.username
        }
    })
    next()
}

router.get('/', async (_, res) => {
  const users = await User.findAll()
  res.json(users)
})

router.post('/', async (req, res) => {
    const {name, username, password} = req.body

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = await User.create({username, name, passwordHash})
    return res.json(newUser)
})

router.put('/:username', userFinder, async (req, res) => {
  req.user.username = req.body.username
  await req.user.save();
  return res.json(req.user);
})

module.exports = router