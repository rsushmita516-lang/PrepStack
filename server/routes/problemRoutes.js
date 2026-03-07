const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createProblem,
  getProblems,
  updateProblem,
  deleteProblem,
  markSolved,
} = require('../controllers/problemController');

// all routes require authentication
router.post('/', auth, createProblem);
router.get('/', auth, getProblems);
router.put('/:id', auth, updateProblem);
router.delete('/:id', auth, deleteProblem);
router.post('/:id/solve', auth, markSolved);

module.exports = router;
