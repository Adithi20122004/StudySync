const express = require("express");
const router  = express.Router();
const auth    = require("../middleware/authMiddleware");
const Task    = require("../models/Task");

router.get("/stats", auth, async (req, res) => {
  try {
    const tasks   = await Task.find({ user: req.user });
    const now     = new Date();
    const weekEnd = new Date(now.getTime() + 7 * 86400000);

    const dueThisWeek = tasks.filter(t => t.dueDate && t.dueDate >= now && t.dueDate <= weekEnd).length;
    const completed   = tasks.filter(t => t.status === "done").length;
    const inReview    = tasks.filter(t => t.status === "review").length;
    const inProgress  = tasks.filter(t => t.status === "in-progress").length;

    res.json({ dueThisWeek, completed, inReview, inProgress, total: tasks.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/timeline", auth, async (req, res) => {
  try {
    const now     = new Date();
    const weekEnd = new Date(now.getTime() + 14 * 86400000);
    const tasks   = await Task.find({
      user: req.user,
      dueDate: { $gte: now, $lte: weekEnd },
      status: { $ne: "done" },
    }).sort({ dueDate: 1 }).limit(5);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/workload", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user, subject: { $exists: true, $ne: "" } });


    const map = {};
    tasks.forEach(t => {
      if (!t.subject) return;
      map[t.subject] = (map[t.subject] || 0) + (t.hours || 0);
    });

    const workload = Object.entries(map)
      .map(([subject, hours]) => ({ subject, hours }))
      .filter(e => e.hours > 0)
      .sort((a, b) => b.hours - a.hours);

    res.json(workload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;