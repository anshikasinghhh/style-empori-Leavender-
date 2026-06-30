const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Task = require('../models/Task');
const InventoryRequest = require('../models/InventoryRequest');

// Helper to get local YYYY-MM-DD date string
const getLocalDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// @POST /api/employee/admin/employees - Create employee account (Admin only)
router.post('/employees', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    const employee = await User.create({
      name,
      email,
      password,
      phone,
      role: 'employee'
    });

    res.status(201).json({
      success: true,
      message: 'Employee account created successfully.',
      employee: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        role: employee.role
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/employee/admin/employees - List all employees (Admin only)
router.get('/employees', protect, authorize('admin'), async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).sort({ createdAt: -1 });
    res.json({ success: true, employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @DELETE /api/employee/admin/employees/:id - Delete employee account (Admin only)
router.delete('/employees/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const employee = await User.findOneAndDelete({ _id: req.params.id, role: 'employee' });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    // Clean up associated employee records
    await Attendance.deleteMany({ employee: req.params.id });
    await Task.deleteMany({ assignedTo: req.params.id });
    await InventoryRequest.deleteMany({ employee: req.params.id });

    res.json({ success: true, message: 'Employee account and related logs deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/employee/admin/employees/:id/coupon-access - Toggle coupon management access (Admin only)
router.put('/employees/:id/coupon-access', protect, authorize('admin'), async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee || employee.role !== 'employee') {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    employee.canManageCoupons = !employee.canManageCoupons;
    await employee.save();

    res.json({
      success: true,
      message: `Coupon access ${employee.canManageCoupons ? 'granted to' : 'revoked from'} ${employee.name}`,
      employee: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        canManageCoupons: employee.canManageCoupons
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/employee/admin/performance - Get all employee performance metrics (Admin only)
router.get('/performance', protect, authorize('admin'), async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' });
    const performanceData = [];

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    for (const emp of employees) {
      // 1. Attendance percentage (out of 22 working days in last 30 days)
      const attRecords = await Attendance.find({ employee: emp._id, punchIn: { $gte: thirtyDaysAgo } });
      const attendanceCount = attRecords.length;
      const attendancePct = Math.min(100, Math.round((attendanceCount / 22) * 100));

      // 2. Total working hours
      const totalHours = attRecords.reduce((sum, r) => sum + (r.workingHours || 0), 0);

      // 3. Tasks statistics
      const totalTasks = await Task.countDocuments({ assignedTo: emp._id });
      const completedTasks = await Task.countDocuments({ assignedTo: emp._id, status: 'Completed' });
      const pendingTasks = await Task.countDocuments({ assignedTo: emp._id, status: { $ne: 'Completed' } });

      // 4. Inventory requests submitted
      const submittedUpdates = await InventoryRequest.countDocuments({ employee: emp._id });
      const approvedUpdates = await InventoryRequest.countDocuments({ employee: emp._id, status: 'approved' });

      // 5. Productivity score
      const taskCompRate = totalTasks > 0 ? (completedTasks / totalTasks) : 0;
      const invApproveRate = submittedUpdates > 0 ? (approvedUpdates / submittedUpdates) : 0;
      const attRate = Math.min(1, attendanceCount / 22);

      const productivityScore = Math.min(100, Math.round(
        (taskCompRate * 70) + (invApproveRate * 15) + (attRate * 15)
      ));

      performanceData.push({
        employee: {
          _id: emp._id,
          name: emp.name,
          email: emp.email,
          phone: emp.phone,
          canManageCoupons: emp.canManageCoupons || false
        },
        attendancePercentage: attendancePct,
        totalWorkingHours: parseFloat(totalHours.toFixed(1)),
        assignedTasks: totalTasks,
        completedTasks,
        pendingTasks,
        inventoryUpdatesSubmitted: submittedUpdates,
        productivityScore
      });
    }

    res.json({ success: true, performance: performanceData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/employee/admin/analytics - Dashboard operational stats and charts (Admin only)
router.get('/analytics', protect, authorize('admin'), async (req, res) => {
  try {
    const todayStr = getLocalDateString();

    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const employeesPresentToday = await Attendance.countDocuments({ dateString: todayStr });
    const employeesAbsent = Math.max(0, totalEmployees - employeesPresentToday);

    const tasksPending = await Task.countDocuments({ status: { $in: ['Pending', 'In Progress'] } });
    
    // Tasks completed today
    const startOfToday = new Date();
    startOfToday.setHours(0,0,0,0);
    const tasksCompletedToday = await Task.countDocuments({ 
      status: 'Completed', 
      updatedAt: { $gte: startOfToday } 
    });

    const requestsPending = await InventoryRequest.countDocuments({ status: 'pending' });
    const requestsApproved = await InventoryRequest.countDocuments({ status: 'approved' });

    // Chart 1: Attendance rate graph (last 15 days)
    const attendanceGraph = [];
    for (let i = 14; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${day}`;

      const presentCount = await Attendance.countDocuments({ dateString: dateStr });
      
      attendanceGraph.push({
        date: `${m}/${day}`,
        present: presentCount,
        absent: Math.max(0, totalEmployees - presentCount)
      });
    }

    // Chart 2: Monthly working hours (last 6 months)
    const monthlyWorkingHours = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const monthNum = d.getMonth() + 1; // 1-indexed

      // Calculate working hours in this month
      const startOfMonth = new Date(year, monthNum - 1, 1);
      const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59, 999);

      const records = await Attendance.find({
        punchIn: { $gte: startOfMonth, $lte: endOfMonth }
      });
      const hours = records.reduce((sum, r) => sum + (r.workingHours || 0), 0);

      monthlyWorkingHours.push({
        month: `${monthNames[monthNum - 1]} ${year}`,
        hours: parseFloat(hours.toFixed(1))
      });
    }

    // Chart 3: Task completion graph status summary
    const tasksPendingCount = await Task.countDocuments({ status: 'Pending' });
    const tasksInProgressCount = await Task.countDocuments({ status: 'In Progress' });
    const tasksCompletedCount = await Task.countDocuments({ status: 'Completed' });

    const taskGraph = [
      { name: 'Pending', value: tasksPendingCount },
      { name: 'In Progress', value: tasksInProgressCount },
      { name: 'Completed', value: tasksCompletedCount }
    ];

    // Chart 4: Inventory updates graph status summary
    const reqPendingCount = await InventoryRequest.countDocuments({ status: 'pending' });
    const reqApprovedCount = await InventoryRequest.countDocuments({ status: 'approved' });
    const reqRejectedCount = await InventoryRequest.countDocuments({ status: 'rejected' });

    const inventoryGraph = [
      { name: 'Pending', value: reqPendingCount },
      { name: 'Approved', value: reqApprovedCount },
      { name: 'Rejected', value: reqRejectedCount }
    ];

    res.json({
      success: true,
      stats: {
        totalEmployees,
        employeesPresentToday,
        employeesAbsent,
        tasksPending,
        tasksCompletedToday,
        inventoryRequestsPending: requestsPending,
        inventoryRequestsApproved: requestsApproved
      },
      attendanceGraph,
      monthlyWorkingHours,
      taskGraph,
      inventoryGraph
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
