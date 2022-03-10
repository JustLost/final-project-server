const router = require("express").Router();
const mongoose = require("mongoose");

const Project = require("../models/Project.model");
const Task = require("../models/Task.model");

router.post("/tasks", (req, res, next) => {
  const { title, description, projectId, creator } = req.body;

  let createTask;

  Task.create({ title, description, project: projectId, creator })
    .then((newTask) => {
      createTask = newTask;
      console.log(newTask);
      return Project.findByIdAndUpdate(
        projectId,
        { $push: { backlog: newTask._id } },
      );
    })
    .then((response) => res.json(createTask))
    .catch((err) => next(err));
    
});

router.get("/tasks", (req, res, next) => {
  Task.find()
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.get("/tasks/:taskId", (req, res, next) => {
  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }

  Task.findById(taskId)
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.put("/tasks/:taskId", (req, res, next) => {
  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }

  Task.findByIdAndUpdate(taskId, req.body, { new: true })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

module.exports = router;
