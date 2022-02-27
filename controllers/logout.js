const router = require('express').Router();

const { Session } = require('../models');

router.delete('/', async (req, res) => {
  const session = await Session.findOne({ userId: req.user, token: req.token });
  session.destroy();
  res.sendStatus(202);
});

module.exports = router;