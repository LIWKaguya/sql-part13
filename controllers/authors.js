const router = require("express").Router();
const sequelize = require("sequelize");

const { Blog } = require("../models");

router.get("/", async (_, res) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('count', sequelize.col("id")), "blogs"],
      [sequelize.fn('sum', sequelize.col('likes')), "likes"],
    ],
    group: ["author"],
    order: [[sequelize.fn("sum", sequelize.col("likes")), "DESC"]],
  });
  res.json(authors)
});

module.exports = router;