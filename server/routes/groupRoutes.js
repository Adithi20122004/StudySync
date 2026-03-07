const express = require("express");
const router  = express.Router();
const auth    = require("../middleware/authMiddleware");
const Group   = require("../models/Group");
const User    = require("../models/User");

router.get("/", auth, async (req, res) => {
  try {
    const groups = await Group.find({
      $or: [{ owner: req.user }, { members: req.user }]
    }).populate('members', 'name email').populate('owner', 'name email');
    res.json(groups);
  } catch (err) { res.status(500).json({ message: err.message }); }
});


router.post("/", auth, async (req, res) => {
  try {
    const { name, subject, color } = req.body;
    const group = await Group.create({ name, subject, color, owner: req.user, members: [req.user] });
    await group.populate('members', 'name email');
    await group.populate('owner', 'name email');
    res.status(201).json(group);
  } catch (err) { res.status(500).json({ message: err.message }); }
});


router.delete("/:id", auth, async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.id, owner: req.user });
    if (!group) return res.status(404).json({ message: "Group not found or not owner" });
    await group.deleteOne();
    res.json({ message: "Group deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post("/:id/members", auth, async (req, res) => {
  try {
    const { email } = req.body;
    const user  = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No user found with that email" });
    const group = await Group.findOne({ _id: req.params.id, owner: req.user });
    if (!group) return res.status(404).json({ message: "Group not found" });
    if (group.members.includes(user._id)) return res.status(400).json({ message: "Already a member" });
    group.members.push(user._id);
    await group.save();
    await group.populate('members', 'name email');
    await group.populate('owner', 'name email');
    res.json(group);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post("/:id/tasks", auth, async (req, res) => {
  try {
    const group = await Group.findOne({
      _id: req.params.id,
      $or: [{ owner: req.user }, { members: req.user }]
    });
    if (!group) return res.status(404).json({ message: "Group not found" });
    group.tasks.push(req.body);
    await group.save();
    res.status(201).json(group);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch("/:id/tasks/:taskId", auth, async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.id });
    if (!group) return res.status(404).json({ message: "Group not found" });
    const task = group.tasks.id(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });
    Object.assign(task, req.body);
    await group.save();
    res.json(group);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;