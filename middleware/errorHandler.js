const { CustomAPIError } = require("../errors/customErrors");

const errorHandlerMiddleware = (err, req, res, next) => {
  console.error("🔥 ERROR LOG:", err); // Log the full error for debugging

  // Handle custom application errors
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({ msg: Object.values(err.errors).map((e) => e.message).join(", ") });
  }

  // Handle duplicate key errors (e.g., unique email constraint)
  if (err.code === 11000) {
    return res.status(400).json({ msg: `Duplicate field value entered: ${JSON.stringify(err.keyValue)}` });
  }

  // Handle JWT authentication errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ msg: "Invalid token, authentication failed" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ msg: "Session expired, please log in again" });
  }

  // Handle missing route (fallback)
  if (err.message === "Not Found") {
    return res.status(404).json({ msg: "Route not found" });
  }

  return res.status(500).json({ msg: "Something went wrong, please try again" });
};

module.exports = errorHandlerMiddleware;
