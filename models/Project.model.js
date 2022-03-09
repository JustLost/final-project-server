const { Schema, model } = require('mongoose');


const userSchema = new Schema(
  {
    name: {
      type: String,      
      required: true,
    },
    sprints: {
      type: Array,
    },
    Backlog: {
      type: Array,
    },
    sprintDuration: {
      type: Number,
      required: true,
    },
    users: {
      type: Array,      
      required: true,
    }
},
  {
    timestamps: true,
  }
);

const Project= model('Project', projectSchema);

module.exports = Project;