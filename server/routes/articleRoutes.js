const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createArticle,
  getArticles,
  updateArticle,
  deleteArticle,
} = require('../controllers/articleController');

router.post('/', auth, createArticle);
router.get('/', auth, getArticles);
router.put('/:id', auth, updateArticle);
router.delete('/:id', auth, deleteArticle);

module.exports = router;
