const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  productCode: { type: String, required: true, unique: true, index: true },
  slug: { type: String, unique: true },
  description: { type: String, default: '' },
  shortDescription: { type: String },
  mrp: {
    type: Number,
    required: true
},
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number },
  discountPercent: { type: Number, default: 0 },
  // category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  category: {
  type: String,
  required: true
},
  subcategory: { type: String },
  images: [{ url: String, alt: String }],
  sizes: [{ size: String, stock: Number }],
  colors: [{ name: String, hex: String }],
  variants: [
{
    color: {
        name: String,
        hex: String
    },

    size: String,

    stock: {
        type: Number,
        default: 0
    }
}
],
  material: { type: String },
  occasion: [String],
  brand: { type: String, default: 'Lavender' },
  sku: { type: String },
  stock: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  tags: [String],
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isFlashSale: { type: Boolean, default: false },
  flashSalePrice: { type: Number },
  flashSaleEnd: { type: Date },
  isFestival: { type: Boolean, default: false },
  festivalTag: { type: String },
  isActive: { type: Boolean, default: true },
  couponCode: { type: String, default: '' },
  weight: { type: Number },
  dimensions: { length: Number, width: Number, height: Number },
  careInstructions: { type: String },
  returnPolicy: { type: String, default: '15 days easy return' }
}, { timestamps: true });

productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
  }
  if (this.originalPrice && this.price) {
    this.discountPercent = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  // Always aggregate total stock from variants when present
  if (Array.isArray(this.variants) && this.variants.length > 0) {
    this.stock = this.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
  } else if (!this.isModified('stock') && this.stock === undefined) {
    // If no variants and stock not explicitly set, default to 0
    this.stock = 0;
  }
  next();
});

// Static method to recalculate stock for all products with variants
productSchema.statics.recalculateAllStock = async function() {
  const products = await this.find({ variants: { $exists: true, $ne: [] } });
  let updated = 0;
  for (const product of products) {
    const oldStock = product.stock;
    product.stock = product.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
    if (oldStock !== product.stock) {
      await product.save();
      updated++;
    }
  }
  return updated;
};

module.exports = mongoose.model('Product', productSchema);
