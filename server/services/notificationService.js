const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * Create a notification for a single user and emit via Socket.io
 */
const createNotification = async (io, { recipient, recipientRole, type, title, message, link = '', relatedId = null }) => {
  try {
    const notification = await Notification.create({
      recipient,
      recipientRole,
      type,
      title,
      message,
      link,
      relatedId
    });

    // Emit real-time event to the specific user
    if (io) {
      io.to(`user:${recipient}`).emit('new_notification', notification);
    }

    return notification;
  } catch (err) {
    console.error('Error creating notification:', err.message);
    return null;
  }
};

/**
 * Notify all admin users
 */
const notifyAdmins = async (io, { type, title, message, link = '', relatedId = null }) => {
  try {
    const admins = await User.find({ role: 'admin', isActive: true }).select('_id');
    const notifications = [];

    for (const admin of admins) {
      const notification = await createNotification(io, {
        recipient: admin._id,
        recipientRole: 'admin',
        type,
        title,
        message,
        link,
        relatedId
      });
      if (notification) notifications.push(notification);
    }

    return notifications;
  } catch (err) {
    console.error('Error notifying admins:', err.message);
    return [];
  }
};

/**
 * Notify all employee users
 */
const notifyEmployees = async (io, { type, title, message, link = '', relatedId = null }) => {
  try {
    const employees = await User.find({ role: 'employee', isActive: true }).select('_id');
    const notifications = [];

    for (const employee of employees) {
      const notification = await createNotification(io, {
        recipient: employee._id,
        recipientRole: 'employee',
        type,
        title,
        message,
        link,
        relatedId
      });
      if (notification) notifications.push(notification);
    }

    return notifications;
  } catch (err) {
    console.error('Error notifying employees:', err.message);
    return [];
  }
};

module.exports = {
  createNotification,
  notifyAdmins,
  notifyEmployees
};
