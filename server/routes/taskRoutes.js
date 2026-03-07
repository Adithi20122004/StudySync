const express = require("express");
const router  = express.Router();
const auth    = require("../middleware/authMiddleware");
const {
  getTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");

router.get("/",            auth, getTasks);
router.post("/",           auth, createTask);
router.put("/:id",         auth, updateTask);
router.patch("/:id/status",auth, updateTaskStatus);
router.delete("/:id",      auth, deleteTask);

module.exports = router;