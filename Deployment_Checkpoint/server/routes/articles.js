const router = require("express").Router();
const Article = require("../models/Article");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const sort = req.query.sort === "popular"
      ? { views: -1 }
      : { createdAt: -1 };

    const filter = req.query.tag
      ? { tags: req.query.tag }
      : {};

    const articles = await Article.find(filter)
      .populate("author", "username")
      .sort(sort)
      .limit(20);
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("author", "username");
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { title, content, coverImage, tags } = req.body;
    const article = await Article.create({
      title,
      content,
      coverImage,
      tags: Array.isArray(tags) ? tags : [],
      author: req.user.id,
    });
    const populated = await article.populate("author", "username");
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { title, content, coverImage, tags } = req.body;
    const article = await Article.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id },
      { title, content, coverImage, tags: Array.isArray(tags) ? tags : [] },
      { new: true }
    ).populate("author", "username");
    if (!article) return res.status(404).json({ message: "Article not found or not yours" });
    res.json(article);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const article = await Article.findOneAndDelete({ _id: req.params.id, author: req.user.id });
    if (!article) return res.status(404).json({ message: "Article not found or not yours" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
