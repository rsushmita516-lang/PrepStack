const Article = require('../models/Article');
const User = require('../models/User');

// create a new article; author is inferred from the token
exports.createArticle = async (req, res) => {
  try { 
    const { title, content, tags } = req.body;
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const article = new Article({ title, content, tags, author: user._id });
    await article.save();
    res.status(201).json(article);
  } catch (err) {
    console.error('createArticle error', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getArticles = async (req, res) => {
  try {
    const filter = {};
    if (req.query.tag) filter.tags = req.query.tag;
    const articles = await Article.find(filter).populate('author', 'email displayName');
    res.json(articles);
  } catch (err) {
    console.error('getArticles error', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteArticle error', err);
    res.status(500).json({ error: 'Server error' });
  }
};
