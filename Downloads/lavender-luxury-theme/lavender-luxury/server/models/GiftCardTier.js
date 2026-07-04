const mongoose = require('mongoose');

const giftCardTierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
    unique: true,
  },
  bonusAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  benefits: [{
    type: String,
    trim: true,
  }],
  sortOrder: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  color: {
    type: String,
    default: '#6B21A8',
  },
}, { timestamps: true });

// Seed default tiers if none exist
giftCardTierSchema.statics.seedDefaults = async function () {
  const count = await this.countDocuments();
  if (count === 0) {
    const defaults = [
      {
        name: 'Lavender Mini',
        amount: 500,
        bonusAmount: 25,
        benefits: ['Digital gift card', 'Personalized message', 'Valid for 12 months'],
        sortOrder: 1,
        color: '#a78bfa',
      },
      {
        name: 'Lavender Silver',
        amount: 1000,
        bonusAmount: 75,
        benefits: ['Free gift wrap', 'Early sale access', 'Digital greeting card'],
        sortOrder: 2,
        color: '#94a3b8',
      },
      {
        name: 'Lavender Gold',
        amount: 1500,
        bonusAmount: 150,
        benefits: ['Free shipping', 'Premium gift wrapping', 'Early access to new collections'],
        sortOrder: 3,
        color: '#d4a853',
      },
      {
        name: 'Lavender Platinum',
        amount: 2000,
        bonusAmount: 250,
        benefits: ['Free express shipping', 'Luxury gift packaging', 'Priority customer support', 'Exclusive member offers'],
        sortOrder: 4,
        color: '#6B21A8',
      },
    ];
    await this.insertMany(defaults);
    console.log('Default gift card tiers seeded');
  }
};

module.exports = mongoose.model('GiftCardTier', giftCardTierSchema);
