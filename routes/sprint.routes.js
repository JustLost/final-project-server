const router = require("express").Router();
const mongoose = require("mongoose");

const Sprint = require("../models/Sprint.model")
const Project = require("../models/Project.model");
const Task = require("../models/Task.model");


router.post("/sprints", (req, res, next) => {
  const { title, description, projectId } = req.body;

  Task.create({ title, description, project: projectId })
    .then((newTask) => {
      return Project.findByIdAndUpdate(
        projectId,
        { $push: { sprints: newTask._id } },
        { new: true }
      );
    })
    .then((response) => res.json(response))
    .catch((err) => next(err));
});

router.get("/sprints", (req, res, next) => {
  Task.find()
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.get("/sprints/:sprintId", (req, res, next) => {
  const { sprintId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(sprintId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }

  Task.findById(sprintId)
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.put("/sprints/:sprintId", (req, res, next) => {
  const { sprintId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(sprintId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }

  Task.findByIdAndUpdate(sprintId, req.body, { new: true })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

module.exports = router;
