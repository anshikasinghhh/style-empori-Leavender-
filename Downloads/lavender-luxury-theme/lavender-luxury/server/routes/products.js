const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
const { staffOnly } = require('../middleware/staff');

const CATEGORY_SLUG_TO_NAME = {
  saree: 'Saree',
  kurti: 'Kurti',
  croptop: 'Crop Top',
  pants: 'Pants',
  shawl: 'Shawl',
  kidswear: 'Kidswear',
  'night-gown': 'Night Gown',
  'coord-sets': 'Co-ord Sets',
  bags: 'Bags',
  bodycon: 'Bodycon',
  casuals: 'Casuals',
  'churidar-sets': 'Churidar Sets',
};

const buildCategoryQuery = (category) => {
  const normalized = category.trim().toLowerCase();
  const displayName = CATEGORY_SLUG_TO_NAME[normalized];
  if (displayName) {
    return { $regex: new RegExp('^' + displayName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') };
  }
  return { $regex: new RegExp('^' + normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:\\s|$)', 'i') };
};
// @GET /api/products - Get all products with filters
router.get('/', async (req, res) => {
  try {
    const { category, subcategory, minPrice, maxPrice, sort, search, isFeatured,
      isNewArrival, isBestSeller, isFlashSale, isFestival, page = 1, limit = 12 } = req.query;

    // Validate and sanitize pagination parameters
    let pageNum = Math.max(1, parseInt(page) || 1);
    let limitNum = Math.min(Math.max(1, parseInt(limit) || 12), 100); // Cap limit at 100
    
    const query = { isActive: true };
    if (category) {
      query.category = buildCategoryQuery(category);
    }
    if (subcategory) query.subcategory = { $regex: new RegExp('^' + subcategory + '$', 'i') };
    if (minPrice || maxPrice) query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
    if (isFeatured === 'true') query.isFeatured = true;
    if (isNewArrival === 'true') query.isNewArrival = true;
    if (isBestSeller === 'true') query.isBestSeller = true;
    if (isFlashSale === 'true') query.isFlashSale = true;
    if (isFestival === 'true') query.isFestival = true;
    if (search) query.$text = { $search: search };

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'popular') sortOption = { sold: -1 };
    else if (sort === 'rating') sortOption = { ratings: -1 };

    const total = await Product.countDocuments(query);
    const skipValue = (pageNum - 1) * limitNum;
    
    const products = await Product.find(query)
      
      .sort(sortOption)
      .limit(limitNum)
      .skip(skipValue);

    res.json({ success: true, products, total, page: pageNum, pages: Math.ceil(total / limitNum) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/products - Admin & employee
router.post('/', protect, staffOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) {
    // handle duplicate productCode error
    if (err.code === 11000 && err.keyPattern && err.keyPattern.productCode) {
      return res.status(400).json({ success: false, message: 'Product with same code exists, try a different code' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/products/:id - Admin & employee
router.put('/:id', protect, staffOnly, async (req, res) => {
  try {
    console.log('PUT /api/products/:id - Request body:', req.body);
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    // assign incoming fields and save so pre-save hooks run (e.g., aggregate stock)
    Object.assign(product, req.body || {});
    await product.save();
    console.log('Product saved successfully:', product);
    res.json({ success: true, product });
  } catch (err) {
    console.error('Error updating product:', err);
    if (err.code === 11000 && err.keyPattern && err.keyPattern.productCode) {
      return res.status(400).json({ success: false, message: 'Product with same code exists, try a different code' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/products/:id/restock - Safely increment stock or a variant stock
router.put('/:id/restock', protect, staffOnly, async (req, res) => {
  try {
    const { increment = 0, variantIndex, variantSize, variantColorName } = req.body || {};
    const inc = Number(increment) || 0;
    if (!inc) return res.status(400).json({ success: false, message: 'Invalid increment value' });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // If product has variants, update the matching variant (by index, size, or color), then recalc total
    if (Array.isArray(product.variants) && product.variants.length > 0) {
      let idx = -1;
      if (typeof variantIndex === 'number') idx = variantIndex;
      else if (variantSize) idx = product.variants.findIndex(v => String(v.size).toLowerCase() === String(variantSize).toLowerCase());
      else if (variantColorName) idx = product.variants.findIndex(v => v.color && String(v.color.name).toLowerCase() === String(variantColorName).toLowerCase());

      if (idx > -1 && product.variants[idx]) {
        product.variants[idx].stock = (Number(product.variants[idx].stock) || 0) + inc;
      } else if (idx === -1) {
        // No matching variant specified — add a new variant with the increment as stock
        product.variants.push({ size: variantSize || 'UNSPECIFIED', color: variantColorName ? { name: variantColorName } : undefined, stock: inc });
      }

      // Recalculate aggregate stock (pre-save also does this, but do it explicitly)
      product.stock = product.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
      await product.save();
      return res.json({ success: true, product });
    }

    // No variants — increment root stock directly using atomic update
    const updated = await Product.findByIdAndUpdate(req.params.id, { $inc: { stock: inc } }, { new: true });
    return res.json({ success: true, product: updated });
  } catch (err) {
    console.error('Error restocking product:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// @DELETE /api/products/:id - Admin & employee
router.delete('/:id', protect, staffOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
