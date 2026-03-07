const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  subject: { type: String },
  color:   { type: String, default: '#6366F1' },
  owner:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tasks: [{
    title:    { type: String, required: true },
    status:   { type: String, enum: ['todo','in-progress','review','done'], default: 'todo' },
    priority: { type: String, enum: ['low','medium','high'], default: 'medium' },
    dueDate:  { type: Date },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }],
}, { timestamps: true });

module.exports = mongoose.model("Group", groupSchema);