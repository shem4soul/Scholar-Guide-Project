const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { createCustomError } = require("../errors/custom-errors");


const generateToken = (user) => {
  console.log("🔹 Generating Token, JWT_SECRET:", process.env.JWT_SECRET); // Debugging line
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.signup = async (req, res, next) => {
  try {
    console.log("🔹 Signup attempt:", req.body);

    const { name, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      console.log("⚠️ User already exists:", email);
      return next(createCustomError("User already exists", 400));
    }

    user = new User({ name, email, password });
    await user.save();

    
    const token = generateToken(user);

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
      return next(createCustomError("Invalid credentials", 400));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("⚠️ Incorrect password for:", email);
      return next(createCustomError("Invalid credentials", 400));
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
