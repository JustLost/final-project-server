const router = require("express").Router();
const mongoose = require("mongoose");

const Sprint = require("../models/Sprint.model")
const Project = require("../models/Project.model");
const Task = require("../models/Task.model");


router.post("/sprints", (req, res, next) => {
  const {
    name,
    startingDate,
    duration,
    standUps,
    review,
    tasksId,
    retrospective,
  } = req.body;

  Sprint.create({  name, startingDate, duration, standUps, review, tasks: tasksId, retrospective  })
    .then((newSprint) => {
      createSprint = newSprint;
      return Project.findByIdAndUpdate(
        tasksId,
        { $push: { sprints: newSprint._id } },
      );
    })
    .then((response) => res.json(createSprint))
    .catch((err) => next(err));
});

router.get("/sprints", (req, res, next) => {
  Sprint.find()
    .populate("tasks")
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.get("/sprints/:sprintId", (req, res, next) => {
  const { sprintId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(sprintId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }

  Sprint.findById(sprintId)
    .populate("tasks")
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
