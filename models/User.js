const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ["admin", "teacher", "student", "pending_teacher"], 
      default: "student" 
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
  },
  { timestamps: true } // Enables createdAt and updatedAt timestamps
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Generate Password Reset Token
UserSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = resetToken;
  this.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
