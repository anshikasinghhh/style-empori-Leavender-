const mongoose = require('mongoose');

// Category Model
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, unique: true },
  description: String,
  image: String,
  icon: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

//chatbot

// Order Model
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, unique: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    image: String,
    price: Number,
    quantity: Number,
    size: String,
    color: String
  }],
  shippingAddress: {
    name: String, street: String, city: String,
    state: String, pincode: String, phone: String
  },
  paymentMethod: { type: String, enum: ['razorpay', 'stripe', 'cod'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  paymentId: String,
  orderStatus: {
    type: String,
    enum: ['placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
    default: 'placed'
  },
  statusHistory: [{
    status: String, timestamp: Date, note: String
  }],
  subtotal: Number,
  discount: Number,
  couponCode: String,
  couponDiscount: Number,
  shippingCost: { type: Number, default: 0 },
  handlingCharge: { type: Number, default: 0 },
  tax: Number,
  giftWrap: { type: Boolean, default: false },
  giftWrapCost: { type: Number, default: 0 },
  donationAmount: { type: Number, default: 0 },
  total: Number,
  estimatedDelivery: Date,
  deliveredAt: Date,
  notes: String,
  shiprocketOrderId: String,
  shiprocketShipmentId: String,
  shiprocketSyncStatus: { type: String, enum: ['synced', 'failed', null], default: null },
  shiprocketSyncError: String
}, { timestamps: true });

orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = 'VE' + Date.now() + Math.floor(Math.random() * 1000);
  }
  next();
});

// Cart Model
const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
    size: String,
    color: String
  }]
}, { timestamps: true });

// Wishlist Model
const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

// Review Model
const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: String,
  comment: String,
  images: [String],
  isVerified: { type: Boolean, default: false },
  helpful: { type: Number, default: 0 }
}, { timestamps: true });

// Coupon Model
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  type: { type: String, enum: ['percentage', 'fixed'], required: true },
  value: { type: Number, required: true },
  minOrderValue: { type: Number, default: 0 },
  maxDiscount: Number,
  usageLimit: { type: Number, default: 1 },
  usedCount: { type: Number, default: 0 },
  expiresAt: Date,
  isActive: { type: Boolean, default: true },
  applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
}, { timestamps: true });

// Payment Model
const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  currency: { type: String, default: 'INR' },
  method: String,
  gateway: { type: String, enum: ['razorpay', 'stripe', 'cod'] },
  gatewayPaymentId: String,
  gatewayOrderId: String,
  status: { type: String, enum: ['created', 'success', 'failed', 'refunded'], default: 'created' },
  metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = {
  Category: mongoose.model('Category', categorySchema),
  Order: mongoose.model('Order', orderSchema),
  Cart: mongoose.model('Cart', cartSchema),
  Wishlist: mongoose.model('Wishlist', wishlistSchema),
  Review: mongoose.model('Review', reviewSchema),
  Coupon: mongoose.model('Coupon', couponSchema),
  Payment: mongoose.model('Payment', paymentSchema)
};
