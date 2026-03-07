const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// A Problem document represents a coding problem that the user wants to track.
// It contains a URL, optional notes, a list of tags (e.g. 'dp', 'graph'), the
// platform where the problem is hosted, and an array of users who have solved
// it. Storing the solvedBy array makes it easy to compute statistics later.

const problemSchema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  notes: String,
  tags: [String],
  platform: String,
  solvedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Problem', problemSchema);
