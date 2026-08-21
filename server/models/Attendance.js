const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateString: {
    type: String,
    required: true // Format: YYYY-MM-DD
  },
  punchIn: {
    type: Date,
    required: true
  },
  punchOut: {
    type: Date
  },
  workingHours: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late'],
    default: 'Present'
  }
}, { timestamps: true });

// Ensure an employee has only one attendance record per day
attendanceSchema.index({ employee: 1, dateString: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
