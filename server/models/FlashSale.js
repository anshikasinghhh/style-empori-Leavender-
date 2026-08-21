const mongoose = require('mongoose');

const flashSaleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'active', 'expired', 'cancelled'],
    default: 'scheduled'
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  discountPercent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  bannerText: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// Auto-determine status based on dates
flashSaleSchema.pre('save', function (next) {
  const now = new Date();
  if (this.status === 'cancelled') return next();
  if (now < this.startDate) {
    this.status = 'scheduled';
  } else if (now >= this.startDate && now <= this.endDate) {
    this.status = 'active';
  } else if (now > this.endDate) {
    this.status = 'expired';
  }
  next();
});

// Static method to get current active flash sale
flashSaleSchema.statics.getActiveSale = function () {
  const now = new Date();
  return this.findOne({
    isActive: true,
    status: { $ne: 'cancelled' },
    startDate: { $lte: now },
    endDate: { $gte: now }
  }).sort({ createdAt: -1 }).populate('products', 'name price flashSalePrice images isFlashSale');
};

module.exports = mongoose.model('FlashSale', flashSaleSchema);
