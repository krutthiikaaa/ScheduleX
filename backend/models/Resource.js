const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: String,
  type: String, // PDF, Link, Document, etc.
  subject: String,
  url: String,
  isFavorite: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.models.Resource || mongoose.model('Resource', resourceSchema);
