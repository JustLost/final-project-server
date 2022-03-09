const { Schema, model } = require('mongoose');
const mongoose = require("mongoose");

const commentSchema = new Schema({
  date: { type: date },
  comment: { type: String, required: true },
  user: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
});

const sprintSchema = new Schema(
  {
    name: {
        type: String,      
        required: true,
    },
    startingDate: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    standUps: {
        type: Date,
        required: true,
    },
    review: {
        type: Date,
        required: true,
    },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task", required: true }],
    Retrospective: {
        type: Date,
        required: true,
    },
    RetrospectiveComments: {}
  },
  {
    timestamps: true,
  }
);



const Sprint= model('Sprint', sprintSchema);

module.exports = Sprint;