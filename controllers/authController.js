const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { 
  BadRequestError, 
  UnauthorizedError, 
  ForbiddenError 
} = require("../errors/customErrors");

const generateToken = (user) => {
  console.log("🔹 Generating Token, JWT_SECRET:", process.env.JWT_SECRET);
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.signup = async (req, res, next) => {
  try {
    console.log("🔹 Signup attempt:", req.body);

    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      console.log("⚠️ User already exists:", email);
      return next(new BadRequestError("User already exists"));
    }

    // Count users in database
    const userCount = await User.countDocuments();

    // Assign roles
    let assignedRole = userCount === 0 ? "admin" : "student"; // First user becomes admin, others default to student
    if (role === "teacher" && userCount > 0) {
      assignedRole = "pending_teacher"; // Teachers require admin approval
    }

    user = new User({ name, email, password, role: assignedRole }); // ✅ Assigns the correct role
    await user.save();

    const token = generateToken(user);

    console.log(`✅ User registered as ${assignedRole}:`, email);
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("❌ Signup error:", err);
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    console.log("🔹 Login attempt:", req.body);

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.log("⚠️ User not found:", email);
      return next(new UnauthorizedError("Invalid credentials"));
    }

    // Prevent pending teachers from logging in
    if (user.role === "pending_teacher") {
      console.log("⚠️ Pending teacher cannot log in:", email);
      return next(new ForbiddenError("Your teacher account is awaiting approval"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("⚠️ Incorrect password for:", email);
      return next(new UnauthorizedError("Invalid credentials"));
    }

    const token = generateToken(user);

    console.log("✅ Login successful for:", email);
    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    next(err);
  }
};
