const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// An Article is a piece of content that a user can post. Tags allow filtering
// by topic (dp, tree, etc.) and the author field links to the user who
// submitted it.

const articleSchema = new Schema({
  title: { type: String, required: true },
  content: String,
  tags: [String],
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Article', articleSchema);
