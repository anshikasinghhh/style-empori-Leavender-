const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    trim: true,
    maxLength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minLength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: { type: String },
  avatar: { type: String, default: '' },
  role: {
    type: String,
    enum: ['customer', 'admin', 'employee'],
    default: 'customer'
  },
  addresses: [{
    label: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: { type: Boolean, default: false }
  }],
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  loyaltyCoupons: [{
    code: String,
    earnedAt: { type: Date, default: Date.now },
    isUsed: { type: Boolean, default: false },
    expiresAt: Date,
    discountValue: Number,
    couponType: String
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.getJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
};
module.exports = mongoose.model('User', userSchema);
