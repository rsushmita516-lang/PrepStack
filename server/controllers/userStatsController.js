const User = require('../models/User');
const Problem = require('../models/Problem');

// returns per-tag solve counts and badge list for the logged-in user
exports.getStats = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const solvedProblems = await Problem.find({ solvedBy: user._id });

    const tagCounts = {};
    solvedProblems.forEach((p) => {
      p.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // example milestone: badge when count >= 20
    const badges = Object.entries(tagCounts)
      .filter(([tag, count]) => count >= 20)
      .map(([tag]) => `${tag} master`);

    res.json({ tagCounts, badges });
  } catch (err) {
    console.error('getStats error', err);
    res.status(500).json({ error: 'Server error' });
  }
};
