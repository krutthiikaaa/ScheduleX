const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: String,
  type: String, // PDF, Video, Link, Document, etc.
  subject: String,
  url: String, // Web URL or Base64 Data URI
  fileName: String,
  fileSize: String,
  isFavorite: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.models.Resource || mongoose.model('Resource', resourceSchema);
