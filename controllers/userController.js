const User = require("../models/User");
const { NotFoundError, ForbiddenError } = require("../errors/customErrors");

// Get current user profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return next(new NotFoundError("User not found"));

    res.json({ status: "success", user });
  } catch (err) {
    next(err);
  }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json({ status: "success", users });
  } catch (err) {
    next(err);
  }
};

// Get all students (Admin & Teacher only)
exports.getAllStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
    res.json({ status: "success", students });
  } catch (err) {
    next(err);
  }
};

// Approve a pending teacher (Admin only)
exports.approveTeacher = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return next(new NotFoundError("User not found"));
    if (user.role !== "pending_teacher") {
      return next(new ForbiddenError("User is not awaiting approval"));
    }

    user.role = "teacher";
    await user.save();

    res.json({ status: "success", message: "Teacher approved successfully", user });
  } catch (err) {
    next(err);
  }
};
