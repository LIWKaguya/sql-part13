const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const router = require('express').Router()
const { User, Session } = require('../models')
const { SECRET } = require('../util/config')
const { disabled } = require('express/lib/application')

router.post('/', async (req, res) => {
    const {body} = req
    const user = await User.findOne({
        where: {
            username: body.username,
            disabled: false
        }
    })

    const correctPass = user === null ? false : await bcrypt.compare(body.password, user.passwordHash)
    
    if(!(user && correctPass)) {
        return res.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user.id
    }

    const token = jwt.sign(userForToken, SECRET)
    await Session.create({ userId: user.id, token });

    res.status(200).send({token, username, name: user.name})
})

module.exports = router;