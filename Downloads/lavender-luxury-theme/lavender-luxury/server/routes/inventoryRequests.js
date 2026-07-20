const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const InventoryRequest = require('../models/InventoryRequest');
const Product = require('../models/Product');

// @GET /api/employee/inventory-requests/test - Test endpoint to verify model works
router.get('/test', async (req, res) => {
  try {
    console.log('=== TEST ENDPOINT ===');
    console.log('Testing InventoryRequest model...');
    
    // Test 1: Check if model is loaded
    console.log('Model name:', InventoryRequest.modelName);
    console.log('Collection name:', InventoryRequest.collection.name);
    
    // Test 2: Try to count documents
    const count = await InventoryRequest.countDocuments();
    console.log('Document count:', count);
    
    // Test 3: Try to find all documents
    const all = await InventoryRequest.find().limit(1);
    console.log('Sample document:', all[0] ? all[0]._id : 'none');
    
    res.json({ 
      success: true, 
      message: 'Model test passed',
      modelName: InventoryRequest.modelName,
      collectionName: InventoryRequest.collection.name,
      count,
      hasData: count > 0
    });
  } catch (err) {
    console.error('❌ Test endpoint error:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message,
      error: err.toString()
    });
  }
});

// @POST /api/employee/inventory-requests - Submit a stock update request (Employee only)
router.post('/', protect, authorize('employee'), async (req, res) => {
  try {
    console.log('=== POST /api/employee/inventory-requests ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User:', req.user);
    const { product: productId, variant, updatedStock, remarks } = req.body;

    if (!productId || !variant || !variant.size || updatedStock === undefined) {
      console.log('❌ Validation failed: missing required fields');
      console.log('productId:', productId);
      console.log('variant:', variant);
      console.log('updatedStock:', updatedStock);
      return res.status(400).json({ success: false, message: 'Please provide product, variant (size/color), and updated stock.' });
    }

    console.log('Looking up product:', productId);
    const product = await Product.findById(productId);
    if (!product) {
      console.log('❌ Product not found:', productId);
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    console.log('✅ Product found:', product.name);

    // Determine previous stock for this specific variant
    let previousStock = 0;
    const existingVariant = product.variants.find(v =>
      v.size === variant.size &&
      (!variant.color?.name || v.color?.name?.toLowerCase() === variant.color.name.toLowerCase())
    );

    if (existingVariant) {
      previousStock = existingVariant.stock || 0;
    }
    console.log('Previous stock:', previousStock);

    const requestData = {
      product: productId,
      employee: req.user._id,
      previousStock,
      updatedStock,
      variant,
      remarks,
      status: 'pending'
    };
    console.log('Creating request with data:', JSON.stringify(requestData, null, 2));

    const request = await InventoryRequest.create(requestData);
    console.log('✅ Request created successfully:', request._id);
    console.log('Request details:', JSON.stringify(request, null, 2));

    res.status(201).json({ success: true, message: 'Inventory update request submitted for review.', request });
  } catch (err) {
    console.error('❌ Error creating inventory request:');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
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
    console.log('GET /api/employee/inventory-requests/admin/all - Fetching all requests');
    const requests = await InventoryRequest.find()
      .populate('product', 'name productCode images variants')
      .populate('employee', 'name email')
      .sort({ createdAt: -1 });

    console.log('Found requests:', requests.length);
    console.log('Sample request:', requests[0] ? requests[0]._id : 'none');
    res.json({ success: true, requests });
  } catch (err) {
    console.error('Error fetching inventory requests:', err);
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

// @PUT /api/employee/inventory-requests/:id/complete - Mark request as completed (Employee only)
router.put('/:id/complete', protect, authorize('employee'), async (req, res) => {
  try {
    const request = await InventoryRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    if (request.status !== 'approved') {
      return res.status(400).json({ success: false, message: `Request must be approved before marking as completed. Current status: ${request.status}.` });
    }

    if (request.employee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only complete your own requests.' });
    }

    request.status = 'completed';
    await request.save();

    res.json({ success: true, message: 'Request marked as completed.', request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
