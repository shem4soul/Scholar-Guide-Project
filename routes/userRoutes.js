// const express = require("express");
// const { auth, authorizeRoles } = require("../middleware/authMiddleware");
// const User = require("../models/User");

// const router = express.Router();

// /**
//  * @swagger
//  * tags:
//  *   name: Users
//  *   description: User management routes
//  */

// /**
//  * @swagger
//  * /api/users/profile:
//  *   get:
//  *     summary: Get user profile
//  *     tags: [Users]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: User profile retrieved successfully
//  *       401:
//  *         description: Unauthorized, token missing
//  *       403:
//  *         description: Access denied
//  */
// router.get("/profile", auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// /**
//  * @swagger
//  * /api/users/all:
//  *   get:
//  *     summary: Get all users (Admin only)
//  *     tags: [Users]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: List of all users
//  *       403:
//  *         description: Access denied
//  */
// router.get("/all", auth, authorizeRoles("admin"), async (req, res) => {
//   try {
//     const users = await User.find().select("-password");
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// /**
//  * @swagger
//  * /api/users/students:
//  *   get:
//  *     summary: Get all students (Admin & Teacher only)
//  *     tags: [Users]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: List of all students
//  *       403:
//  *         description: Access denied
//  */
// router.get("/students", auth, authorizeRoles("admin", "teacher"), async (req, res) => {
//   try {
//     const students = await User.find({ role: "student" }).select("-password");
//     res.json(students);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// /**
//  * @swagger
//  * /api/users/approve-teacher/{id}:
//  *   put:
//  *     summary: Approve a pending teacher (Admin Only)
//  *     description: Allows admins to approve teachers who signed up and were assigned "pending_teacher" role.
//  *     tags: [Users]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         description: The user ID of the pending teacher
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Teacher approved successfully
//  *       404:
//  *         description: User not found
//  *       400:
//  *         description: User is not awaiting approval
//  */
// router.put("/approve-teacher/:id", auth, authorizeRoles("admin"), async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (user.role !== "pending_teacher") {
//       return res.status(400).json({ message: "User is not awaiting approval" });
//     }

//     user.role = "teacher";
//     await user.save();

//     res.json({ message: "Teacher approved successfully", user });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// module.exports = router;
const express = require("express");
const { auth, authorizeRoles } = require("../middleware/authMiddleware");
const {
  getProfile,
  getAllUsers,
  getAllStudents,
  approveTeacher,
} = require("../controllers/userController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management routes
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized, token missing
 *       403:
 *         description: Access denied
 */
router.get("/profile", auth, getProfile);

/**
 * @swagger
 * /api/users/all:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       403:
 *         description: Access denied
 */
router.get("/all", auth, authorizeRoles("admin"), getAllUsers);

/**
 * @swagger
 * /api/users/students:
 *   get:
 *     summary: Get all students (Admin & Teacher only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all students
 *       403:
 *         description: Access denied
 */
router.get("/students", auth, authorizeRoles("admin", "teacher"), getAllStudents);

/**
 * @swagger
 * /api/users/approve-teacher/{id}:
 *   put:
 *     summary: Approve a pending teacher (Admin Only)
 *     description: Allows admins to approve teachers who signed up and were assigned "pending_teacher" role.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user ID of the pending teacher
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Teacher approved successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: User is not awaiting approval
 */
router.put("/approve-teacher/:id", auth, authorizeRoles("admin"), approveTeacher);

module.exports = router;
