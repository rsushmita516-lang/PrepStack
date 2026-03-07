const Problem = require('../models/Problem');
const User = require('../models/User');

// create a new problem document
exports.createProblem = async (req, res) => {
  try {
    const { title, url, notes, tags, platform } = req.body;
    const problem = new Problem({ title, url, notes, tags, platform });
    await problem.save();
    res.status(201).json(problem);
  } catch (err) {
    console.error('createProblem error', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// return all problems (optionally filter by tags/platform)
exports.getProblems = async (req, res) => {
  try {
    const filter = {};
    if (req.query.tag) filter.tags = req.query.tag;
    if (req.query.platform) filter.platform = req.query.platform;
    const problems = await Problem.find(filter).populate('solvedBy', 'email displayName');
    res.json(problems);
  } catch (err) {
    console.error('getProblems error', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// update problem details
exports.updateProblem = async (req, res) => {
  try {
    const updated = await Problem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    console.error('updateProblem error', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// delete a problem
exports.deleteProblem = async (req, res) => {
  try {
    await Problem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Problem deleted' });
  } catch (err) {
    console.error('deleteProblem error', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// mark a problem as solved by the current user
exports.markSolved = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ error: 'Not found' });

    if (!problem.solvedBy.includes(user._id)) {
      problem.solvedBy.push(user._id);
      await problem.save();
    }
    res.json(problem);
  } catch (err) {
    console.error('markSolved error', err);
    res.status(500).json({ error: 'Server error' });
  }
};
