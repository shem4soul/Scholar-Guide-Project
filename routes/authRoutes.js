const express = require("express");
const { signup, login } = require("../controllers/authController");
const { auth, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication routes
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user (defaults to student role)
 *     description: Any user can register. Students are assigned the "student" role by default, and teachers are assigned "pending_teacher" until approved by an admin.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Shittu Emmanuel"
 *               email:
 *                 type: string
 *                 example: "shittu@scholarguide.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 example: "teacher"
 *     responses:
 *       201:
 *         description: User registered successfully (Students get "student" role, teachers get "pending_teacher" role)
 *       400:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
router.post("/signup", signup);

/**
 * @swagger
 * /api/auth/admin/signup:
 *   post:
 *     summary: Register a new admin (Admin Only)
 *     description: Only admins can create new admin accounts. Teachers must be approved using the `/approve-teacher/:id` endpoint.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Admin User"
 *               email:
 *                 type: string
 *                 example: "admin@scholarguide.com"
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *               role:
 *                 type: string
 *                 enum: [admin]
 *                 example: "admin"
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: User already exists or invalid role
 *       403:
 *         description: Access denied - Only admins can create other admins
 */
router.post("/admin/signup", auth, authorizeRoles("admin"), signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     description: Allows any registered user to log in.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "shittu@scholarguide.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login", login);

module.exports = router;
