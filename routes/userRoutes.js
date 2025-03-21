const express = require("express");
const { auth, admin } = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

router.get("/profile", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

router.get("/all", auth, admin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

module.exports = router;
