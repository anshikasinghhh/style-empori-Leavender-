const mongoose = require('mongoose');

const inventoryRequestSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  previousStock: {
    type: Number,
    required: true
  },
  updatedStock: {
    type: Number,
    required: true
  },
  variant: {
    color: {
      name: { type: String },
      hex: { type: String }
    },
    size: { type: String, required: true }
  },
  remarks: {
    type: String,
    default: ''
  },
  suggestedCouponCode: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('InventoryRequest', inventoryRequestSchema);
