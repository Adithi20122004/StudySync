const express  = require("express");
const router   = express.Router();
const auth     = require("../middleware/authMiddleware");
const Resource = require("../models/Resource");

// GET all resources for user
router.get("/", auth, async (req, res) => {
  try {
    const resources = await Resource.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST add resource (link or URL)
router.post("/", auth, async (req, res) => {
  try {
    const { title, subject, type, url } = req.body;
    const resource = await Resource.create({ title, subject, type, url, user: req.user });
    res.status(201).json(resource);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE resource
router.delete("/:id", auth, async (req, res) => {
  try {
    const resource = await Resource.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    res.json({ message: "Resource deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;