import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false, // By default, don't return password field in queries
  },
  role: { // Added role field
    type: String,
    required: [true, 'Role is required'],
    enum: ['user', 'admin'], // Allowed values
    default: 'user', // Default value
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, // You can keep this if you prefer Mongoose's default `createdAt` and `updatedAt` over a manual `createdAt`
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Using a salt round of 12 is generally a good practice
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method for login
// Renaming to correctPassword to match its usage in authController.js
userSchema.methods.correctPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema); // Changed model name to "User" for consistency

export default User;
