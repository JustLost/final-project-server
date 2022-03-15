const router = require("express").Router();
const mongoose = require("mongoose");

const Project = require("../models/Project.model");
const Task = require("../models/Task.model");
const Sprints = require("../models/Project.model")
const User = require("../models/User.model")

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

// TODO: ir buscar o id do assignedTo 
});

router.put("/projects/:projectId", isAuthenticated, async(req, res, next) => {
  const { projectId } = req.params;
  const { name, description, sprints, sprintDuration, timestamps, users } = req.body;
  
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }
  let user = await User.findOne({ email: users });
  //console.log("users are:", user)
  Project.findByIdAndUpdate(projectId,  {name: name, description: description, sprints: sprints, sprintDuration: sprintDuration, timestamps: timestamps, users:[user._id]}, { new: true })
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
