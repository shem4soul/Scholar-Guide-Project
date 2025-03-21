const express = require("express");
const { auth, admin } = require("../middleware/authMiddleware");
const User = require("../models/User");

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "65d7b7e9f4a3c5e5a1f2b9d1"
 *                 name:
 *                   type: string
 *                   example: "Shittu Emmanuel"
 *                 email:
 *                   type: string
 *                   example: "Shittu@scholarguide.com"
 *                 role:
 *                   type: string
 *                   example: "user"
 *       401:
 *         description: Unauthorized, token missing
 *       403:
 *         description: Access denied
 */
router.get("/profile", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

module.exports = router;
