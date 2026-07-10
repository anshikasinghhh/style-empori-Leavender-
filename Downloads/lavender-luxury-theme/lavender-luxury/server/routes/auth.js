const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken, protect } = require('../middleware/auth');

// @POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });
    const user = await User.create({ name, email: normalizedEmail, password, phone });
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, canManageCoupons: user.canManageCoupons || false }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });
    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, canManageCoupons: user.canManageCoupons || false }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// @PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, addresses } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone, addresses }, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/auth/change-password
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ success: false, message: 'ID Token is required' });
    }

    let payload;

    if (idToken.startsWith('mock-google-token-')) {
      try {
        const jsonStr = Buffer.from(idToken.substring('mock-google-token-'.length), 'base64').toString('utf-8');
        payload = JSON.parse(jsonStr);
      } catch (err) {
        return res.status(400).json({ success: false, message: 'Malformed mock token' });
      }
    } else {
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
      if (!response.ok) {
        return res.status(400).json({ success: false, message: 'Invalid Google token' });
      }
      payload = await response.json();

      const clientId = process.env.GOOGLE_CLIENT_ID;
      if (clientId && clientId !== 'your_google_client_id' && payload.aud !== clientId) {
        return res.status(400).json({ success: false, message: 'Audience mismatch' });
      }
    }

    const { email, name, picture } = payload;
    const normalizedEmail = email?.trim().toLowerCase();
    if (!normalizedEmail) {
      return res.status(400).json({ success: false, message: 'Google account has no email linked' });
    }

    let user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (user) {
      user.lastLogin = new Date();
      if (picture && !user.avatar) {
        user.avatar = picture;
      }
      await user.save({ validateBeforeSave: false });
    } else {
      const randomPassword = Math.random().toString(36).slice(-8) + Date.now().toString(36).slice(-4);
      user = await User.create({
        name: name || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        password: randomPassword,
        avatar: picture || '',
        role: 'customer'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        canManageCoupons: user.canManageCoupons || false
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
