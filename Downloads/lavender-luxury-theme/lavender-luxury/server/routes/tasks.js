const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Task = require('../models/Task');

// @POST /api/employee/tasks - Create task (Admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate, type, product } = req.body;

    if (!title || !assignedTo || !dueDate) {
      return res.status(400).json({ success: false, message: 'Please provide title, assigned employee, and due date.' });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy: req.user._id,
      priority,
      dueDate,
      type,
      product: type === 'Inventory' ? product : undefined
    });

    res.status(201).json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/employee/tasks/assigned - Get current employee's assigned tasks
router.get('/assigned', protect, authorize('employee'), async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate('product', 'name productCode images variants')
      .sort({ dueDate: 1, createdAt: -1 });

    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/employee/tasks/admin/all - Get all tasks (Admin only)
router.get('/admin/all', protect, authorize('admin'), async (req, res) => {
  try {
    const { status, priority, employee } = req.query;
    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (employee) query.assignedTo = employee;

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('product', 'name productCode')
      .sort({ createdAt: -1 });

    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/employee/tasks/:id/status - Update task status (Employee or Admin)
router.put('/:id/status', protect, authorize('employee', 'admin'), async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    // Security: Employee can only update their own assigned tasks
    if (req.user.role === 'employee' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this task.' });
    }

    if (status) task.status = status;
    if (remarks !== undefined) task.remarks = remarks;

    await task.save();

    res.json({ success: true, message: 'Task status updated.', task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
