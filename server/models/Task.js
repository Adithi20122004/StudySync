const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    description: { type: String },
    dueDate:     { type: Date },
    subject:     { type: String },
    hours:       { type: Number, default: 0 },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "review", "done"],
      default: "todo",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);