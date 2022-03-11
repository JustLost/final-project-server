const { Schema, model } = require('mongoose');
const mongoose = require("mongoose");

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    sprints: {
      type: Array,
    },
    backlog: {
      type: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    },
    sprintDuration: {
      type: Number,
      required: true,
    },
    users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  },
  {
    timestamps: true,
  }
);

const Project= model('Project', projectSchema);

module.exports = Project;