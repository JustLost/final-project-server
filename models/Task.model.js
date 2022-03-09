const { Schema, model } = require('mongoose');

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
        creator: {
            type: UserId,
            required: true,
        },
        assignedTo: {
            type: UserId,
        }
    },
    {
        timestamps: true,
    }
);

const Task= model('Task', taskSchema);

module.exports = Task;