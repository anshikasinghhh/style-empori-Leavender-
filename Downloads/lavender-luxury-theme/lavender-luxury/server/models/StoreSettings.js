const mongoose = require('mongoose');

const storeSettingsSchema = new mongoose.Schema({
  key: { type: String, default: 'global', unique: true },
  name: { type: String, default: 'Lavender' },
  email: { type: String, default: 'hello@lavender-styleemporio.in' },
  phone: { type: String, default: '+91 98765 43210' },
  address: { type: String, default: 'Fashion District, Bandra, Mumbai 400050' },
  currency: { type: String, default: 'INR' },
  freeShippingThreshold: { type: Number, default: 999 },
  tagline: { type: String, default: 'The Style Emporio' },
  metaDesc: { type: String, default: 'Premium ethnic & traditional fashion' },
  handlingCharge: { type: Number, default: 0 },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('StoreSettings', storeSettingsSchema);
