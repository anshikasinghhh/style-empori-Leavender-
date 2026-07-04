const express = require('express');
const router = express.Router();
const FlashSale = require('../models/FlashSale');
const Product = require('../models/Product');
const { protect, adminOrEmployee } = require('../middleware/auth');

// @route   GET /api/flash-sales
// @desc    Get all flash sales (with optional status filter)
// @access  Protected (Admin/Employee)
router.get('/', protect, adminOrEmployee, async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const sales = await FlashSale.find(query)
      .sort({ createdAt: -1 })
      .populate('products', 'name price flashSalePrice images isFlashSale stock');

    res.json(sales);
  } catch (err) {
    console.error('Get flash sales error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/flash-sales/active
// @desc    Get currently active flash sale (public)
// @access  Public
router.get('/active', async (req, res) => {
  try {
    const sale = await FlashSale.getActiveSale();
    res.json(sale || null);
  } catch (err) {
    console.error('Get active flash sale error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/flash-sales/:id
// @desc    Get single flash sale
// @access  Protected (Admin/Employee)
router.get('/:id', protect, adminOrEmployee, async (req, res) => {
  try {
    const sale = await FlashSale.findById(req.params.id)
      .populate('products', 'name price flashSalePrice images isFlashSale stock category');
    if (!sale) return res.status(404).json({ message: 'Flash sale not found' });
    res.json(sale);
  } catch (err) {
    console.error('Get flash sale error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/flash-sales
// @desc    Create a new flash sale
// @access  Protected (Admin/Employee)
router.post('/', protect, adminOrEmployee, async (req, res) => {
  try {
    const { name, description, startDate, endDate, products, discountPercent, bannerText } = req.body;

    if (!name || !startDate || !endDate) {
      return res.status(400).json({ message: 'Name, start date, and end date are required' });
    }

    const sale = new FlashSale({
      name,
      description: description || '',
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      products: products || [],
      discountPercent: discountPercent || 0,
      bannerText: bannerText || '',
      createdBy: req.user._id,
      isActive: true
    });

    await sale.save();

    // Mark selected products as flash sale
    if (products && products.length > 0) {
      await Product.updateMany(
        { _id: { $in: products } },
        { isFlashSale: true }
      );
    }

    const populated = await FlashSale.findById(sale._id)
      .populate('products', 'name price flashSalePrice images isFlashSale stock');

    res.status(201).json(populated);
  } catch (err) {
    console.error('Create flash sale error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/flash-sales/:id
// @desc    Update a flash sale
// @access  Protected (Admin/Employee)
router.put('/:id', protect, adminOrEmployee, async (req, res) => {
  try {
    const { name, description, startDate, endDate, products, discountPercent, bannerText, isActive, status } = req.body;

    const sale = await FlashSale.findById(req.params.id);
    if (!sale) return res.status(404).json({ message: 'Flash sale not found' });

    // Remove old products from flash sale if changing products
    if (products) {
      const oldProducts = sale.products.map(p => p.toString());
      const newProducts = products.filter(p => !oldProducts.includes(p));
      const removedProducts = oldProducts.filter(p => !products.includes(p));

      // Mark new products as flash sale
      if (newProducts.length > 0) {
        await Product.updateMany({ _id: { $in: newProducts } }, { isFlashSale: true });
      }
      // Remove flash sale flag from removed products (only if not in any other active sale)
      if (removedProducts.length > 0) {
        const otherActiveSales = await FlashSale.find({
          _id: { $ne: sale._id },
          status: { $ne: 'cancelled' },
          isActive: true
        });
        const stillInSale = otherActiveSales.flatMap(s => s.products.map(p => p.toString()));
        const toRemove = removedProducts.filter(p => !stillInSale.includes(p));
        if (toRemove.length > 0) {
          await Product.updateMany({ _id: { $in: toRemove } }, { isFlashSale: false });
        }
      }
    }

    if (name !== undefined) sale.name = name;
    if (description !== undefined) sale.description = description;
    if (startDate !== undefined) sale.startDate = new Date(startDate);
    if (endDate !== undefined) sale.endDate = new Date(endDate);
    if (products !== undefined) sale.products = products;
    if (discountPercent !== undefined) sale.discountPercent = discountPercent;
    if (bannerText !== undefined) sale.bannerText = bannerText;
    if (isActive !== undefined) sale.isActive = isActive;
    if (status !== undefined) sale.status = status;

    await sale.save();

    const populated = await FlashSale.findById(sale._id)
      .populate('products', 'name price flashSalePrice images isFlashSale stock');

    res.json(populated);
  } catch (err) {
    console.error('Update flash sale error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/flash-sales/:id
// @desc    Delete a flash sale
// @access  Protected (Admin/Employee)
router.delete('/:id', protect, adminOrEmployee, async (req, res) => {
  try {
    const sale = await FlashSale.findById(req.params.id);
    if (!sale) return res.status(404).json({ message: 'Flash sale not found' });

    // Remove flash sale flag from products
    const otherActiveSales = await FlashSale.find({
      _id: { $ne: sale._id },
      status: { $ne: 'cancelled' },
      isActive: true
    });
    const stillInSale = otherActiveSales.flatMap(s => s.products.map(p => p.toString()));
    const toRemove = sale.products
      .map(p => p.toString())
      .filter(p => !stillInSale.includes(p));

    if (toRemove.length > 0) {
      await Product.updateMany({ _id: { $in: toRemove } }, { isFlashSale: false });
    }

    await FlashSale.findByIdAndDelete(req.params.id);
    res.json({ message: 'Flash sale deleted' });
  } catch (err) {
    console.error('Delete flash sale error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
