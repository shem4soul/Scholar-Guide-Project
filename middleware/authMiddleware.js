const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Authentication Middleware
exports.auth = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied: No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1]; // ✅ Extract the actual token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password"); // ✅ Fetch user from DB

    if (!req.user) {
      return res.status(401).json({ message: "Access Denied: User not found" });
    }

    if (req.user.role === "pending_teacher") {
      return res.status(403).json({ message: "Your teacher account is awaiting approval" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" }); // ✅ Change 400 to 401 (Unauthorized)
  }
};

// Role-based Authorization Middleware
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied: Unauthorized Role" });
    }
    next();
  };
};
