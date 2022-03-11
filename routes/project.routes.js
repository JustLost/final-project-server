const router = require("express").Router();
const mongoose = require("mongoose");

const Project = require("../models/Project.model");
const Task = require("../models/Task.model");
const Sprints = require("../models/Project.model")

const { isAuthenticated } = require("../middleware/jwt.middleware");

router.post("/projects", isAuthenticated, (req, res, next) => {
  const { name, sprintDuration, users, description } = req.body;

  Project.create({ name, sprintDuration, users, description })
    //.populate("sprints", "backlog")
    .then((response) => res.json(response))
    .catch((err) => next(err));
});

router.get("/projects", isAuthenticated, (req, res, next) => {
  Project.find()
    .populate("backlog sprints")
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.get("/projects/:projectId", isAuthenticated, (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }

  Project.findById(projectId)
    .populate("backlog sprints")
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.put("/projects/:projectId", isAuthenticated, (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }

  Project.findByIdAndUpdate(projectId, req.body, { new: true })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.delete("/projects/:projectId", isAuthenticated, (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }
  Project.findByIdAndRemove(projectId)
    .then(() =>
      res.json({
        message: `Project with ${projectId}ID was removed successfully`,
      })
    )
    .catch((err) => res.json(err));
});

module.exports = router;
