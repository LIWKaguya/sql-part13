const router = require('express').Router();
const { ReadingList, Session } = require('../models');

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

router.post('/', async (req, res) => {
  const readinglist = await ReadingList.create(req.body);
  return res.json(readinglist);
});

router.put('/:id', tokenExtractor, async (req, res) => {
  const read = await ReadingList.findByPk(req.params.id);

  if (read.userId === req.user.id) {
    read.read = req.body.read;
    await read.save();
    res.json(read);
  } else {
    res.status(404).end();
  }
});

module.exports = router;