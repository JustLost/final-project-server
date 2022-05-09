const router = require("express").Router();
const mongoose = require("mongoose");

const Project = require("../models/Project.model");
const Task = require("../models/Task.model");
const User = require("../models/User.model");
const Sprint = require("../models/Sprint.model")

router.post("/backlog/:projectId", (req, res, next) => {
  const { title, description, creator, tag, storyPoints, assignedTo } = req.body;
  const { projectId } = req.params;

  let createTask;

  let assignee = User.findOne({ email: assignedTo })

  Task.create({ title, description, assignedTo: assignee._id , creator, tag, storyPoints })
    .then((newTask) => {
      createTask = newTask;
      console.log(newTask);
      return Project.findByIdAndUpdate(
        { _id: projectId },
        { $push: { backlog: newTask._id } },
      );
    })
    .then((response) => res.json(createTask))
    .catch((err) => next(err));
    
});

router.get("/backlog/:projectId", (req, res, next) => {
  const { projectId } = req.params;

  Project.findById(projectId)
    .populate("backlog")
    .then((response) => res.json(response.backlog))
    .catch((err) => res.json(err));
});

router.get("/backlog/task/:taskId", (req, res, next) => {
  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }

  Task.findById(taskId)
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.put("/task/:taskId", (req, res, next) => {
  const { taskId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }

  Task.findByIdAndUpdate(taskId, req.body, { new: true })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.put("/sprint/add/:taskId",(req, res, next) => {
  const { taskId } = req.params;
  const { sprintId, projectId } = req.body;

  Project.findByIdAndUpdate(projectId,{ $pull: { backlog: taskId } })
  .then((response) => { 
    return Sprint.findByIdAndUpdate(sprintId, { $push: { tasks: taskId } })
  })
  .then((response) => res.json(response))
  .catch((err) => next(err));
});

module.exports = router;
