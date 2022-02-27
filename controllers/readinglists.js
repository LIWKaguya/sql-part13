const router = require('express').Router();
const { ReadingList } = require('../models');

const tokenExtractor = async (req, res, next) => {
    const authorization = req.get("authorization");
    if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
      try {
        req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
      } catch {
        res.status(401).json({ error: "token invalid" });
      }
    } else {
      res.status(401).json({ error: "token missing" });
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