const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
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
      const normalized = category.trim();
      query.category = { $regex: new RegExp('^' + normalized + '(?:\\s|$)', 'i') };
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

// @POST /api/products - Admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/products/:id - Admin only
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @DELETE /api/products/:id - Admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
