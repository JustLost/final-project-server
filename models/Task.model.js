const { Schema, model } = require('mongoose');
const mongoose = require("mongoose");

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["To do", "Doing", "Merge Request", "Done", "Blocked"],
      required: true,
      default: "to do",
    },
    description: {
      type: String,
      required: true,
    },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User"}
  },
  {
    timestamps: true,
  }
);

const Task= model('Task', taskSchema);

module.exports = Task;