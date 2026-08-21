const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Attendance = require('../models/Attendance');

// Helper to get local YYYY-MM-DD date string
const getLocalDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// @POST /api/employee/attendance/punch-in - Punch in for today
router.post('/punch-in', protect, authorize('employee'), async (req, res) => {
  try {
    const todayStr = getLocalDateString();

    // Check if already punched in today
    const existing = await Attendance.findOne({ employee: req.user._id, dateString: todayStr });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already punched in for today.' });
    }

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Late threshold: 09:15 AM
    const isLate = hours > 9 || (hours === 9 && minutes > 15);
    const status = isLate ? 'Late' : 'Present';

    const attendance = await Attendance.create({
      employee: req.user._id,
      dateString: todayStr,
      punchIn: now,
      status
    });

    res.status(201).json({
      success: true,
      message: 'Successfully punched in.',
      attendance
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/employee/attendance/punch-out - Punch out for today
router.post('/punch-out', protect, authorize('employee'), async (req, res) => {
  try {
    const todayStr = getLocalDateString();

    // Find today's attendance record
    const attendance = await Attendance.findOne({ employee: req.user._id, dateString: todayStr });
    if (!attendance) {
      return res.status(404).json({ success: false, message: 'No punch-in record found for today.' });
    }

    if (attendance.punchOut) {
      return res.status(400).json({ success: false, message: 'You have already punched out for today.' });
    }

    const now = new Date();
    attendance.punchOut = now;

    // Calculate working hours in hours with 2 decimal precision
    const diffMs = now.getTime() - attendance.punchIn.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    attendance.workingHours = Math.round(diffHours * 100) / 100;

    await attendance.save();

    res.json({
      success: true,
      message: 'Successfully punched out.',
      attendance
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/employee/attendance/history - Get employee's personal history
router.get('/history', protect, authorize('employee'), async (req, res) => {
  try {
    const history = await Attendance.find({ employee: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/employee/attendance/admin/all - Get all employee attendance records (Admin only)
router.get('/admin/all', protect, authorize('admin'), async (req, res) => {
  try {
    const { employee, date } = req.query;
    const query = {};

    if (employee) {
      query.employee = employee;
    }
    if (date) {
      query.dateString = date;
    }

    const records = await Attendance.find(query)
      .populate('employee', 'name email')
      .sort({ dateString: -1, createdAt: -1 });

    res.json({ success: true, records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
