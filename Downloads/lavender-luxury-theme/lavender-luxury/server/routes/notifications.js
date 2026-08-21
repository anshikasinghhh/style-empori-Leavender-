const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

// @GET /api/notifications — Get current user's notifications (paginated)
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments({ recipient: req.user._id });

    res.json({
      success: true,
      notifications,
      page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/notifications/unread-count — Get unread count for badge
router.get('/unread-count', protect, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false
    });

    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/notifications/:id/read — Mark single as read
router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/notifications/read-all — Mark all as read
router.put('/read-all', protect, async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @DELETE /api/notifications/:id — Delete notification
router.delete('/:id', protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
