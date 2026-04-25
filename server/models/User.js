const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // Never return by default
    },
    role: {
      type: String,
      enum: ['admin', 'client'],
      default: 'client',
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    passwordHash: {
      type: String,
      required: function() { return !this.googleId; },
      minlength: 6,
      select: false, // Never return by default
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

// Compare plain password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
