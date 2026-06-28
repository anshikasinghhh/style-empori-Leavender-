const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const InventoryRequest = require('../models/InventoryRequest');
const Product = require('../models/Product');

// @POST /api/employee/inventory-requests - Submit a stock update request (Employee only)
router.post('/', protect, authorize('employee'), async (req, res) => {
  try {
    const { product: productId, variant, updatedStock, remarks } = req.body;

    if (!productId || !variant || !variant.size || updatedStock === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide product, variant (size/color), and updated stock.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Determine previous stock for this specific variant
    let previousStock = 0;
    const existingVariant = product.variants.find(v => 
      v.size === variant.size && 
      (!variant.color?.name || v.color?.name?.toLowerCase() === variant.color.name.toLowerCase())
    );

    if (existingVariant) {
      previousStock = existingVariant.stock || 0;
    }

    const request = await InventoryRequest.create({
      product: productId,
      employee: req.user._id,
      previousStock,
      updatedStock,
      variant,
      remarks,
      status: 'pending'
    });

    res.status(201).json({ success: true, message: 'Inventory update request submitted for review.', request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/employee/inventory-requests/employee/my - Get logged-in employee's requests
router.get('/employee/my', protect, authorize('employee'), async (req, res) => {
  try {
    const requests = await InventoryRequest.find({ employee: req.user._id })
      .populate('product', 'name productCode images')
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/employee/inventory-requests/admin/all - Get all requests (Admin only)
router.get('/admin/all', protect, authorize('admin'), async (req, res) => {
  try {
    const requests = await InventoryRequest.find()
      .populate('product', 'name productCode images variants')
      .populate('employee', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/employee/inventory-requests/:id/approve - Approve request (Admin only)
router.put('/:id/approve', protect, authorize('admin'), async (req, res) => {
  try {
    const request = await InventoryRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Request is already ${request.status}.` });
    }

    const product = await Product.findById(request.product);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Find if the variant already exists
    const variantIndex = product.variants.findIndex(v => 
      v.size === request.variant.size && 
      (!request.variant.color?.name || v.color?.name?.toLowerCase() === request.variant.color.name.toLowerCase())
    );

    if (variantIndex > -1) {
      // Update existing variant stock
      product.variants[variantIndex].stock = request.updatedStock;
    } else {
      // Add new variant
      product.variants.push({
        color: request.variant.color,
        size: request.variant.size,
        stock: request.updatedStock
      });
    }

    // Re-calculate product root stock as sum of all variant stocks
    product.stock = product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);

    // Save product changes
    await product.save();

    // Mark request approved
    request.status = 'approved';
    await request.save();

    res.json({ success: true, message: 'Request approved and product inventory updated.', request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/employee/inventory-requests/:id/reject - Reject request (Admin only)
router.put('/:id/reject', protect, authorize('admin'), async (req, res) => {
  try {
    const request = await InventoryRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Request is already ${request.status}.` });
    }

    request.status = 'rejected';
    await request.save();

    res.json({ success: true, message: 'Request rejected.', request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
