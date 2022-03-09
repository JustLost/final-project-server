const { Schema, model } = require('mongoose');


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
    tasks: {
        type: Array,
        required: true,
    },
    Retrospective: {
        type: Date,
        required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Sprint= model('Sprint', sprintSchema);

module.exports = Sprint;