const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  title:   { type: String, required: true },
  subject: { type: String },
  type:    { type: String, enum: ['link','pdf','doc','pptx','other'], default: 'link' },
  url:     { type: String, required: true },
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model("Resource", resourceSchema);