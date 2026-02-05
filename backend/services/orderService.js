const { validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');

const GST_RATE = 0.18;

// Perform atomic stock checks and deductions for all items in an order.
// Uses conditional findOneAndUpdate so concurrent orders cannot push stock negative.
const reserveStockForOrder = async (items) => {
  const updatedProducts = [];

  try {
    for (const item of items) {
      const { productId, quantity } = item;

      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: productId,
          stock: { $gte: quantity } // ensures no over-selling
        },
        {
          $inc: { stock: -quantity }
        },
        {
          new: true
        }
      );

      if (!updatedProduct) {
        // Roll back already-updated products to keep stock consistent
        for (const updated of updatedProducts) {
          await Product.findByIdAndUpdate(updated.productId, {
            $inc: { stock: updated.quantity }
          });
        }

        const error = new Error('Insufficient stock for one or more products');
        error.statusCode = 400;
        throw error;
      }

      updatedProducts.push({ productId, quantity });
    }
  } catch (err) {
    throw err;
  }
};

const createOrder = async (req, overrides = {}) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Invalid input');
    error.details = errors.array();
    error.statusCode = 400;
    throw error;
  }

  const { products } = req.body;

  if (!products || !Array.isArray(products) || products.length === 0) {
    const error = new Error('At least one product is required');
    error.statusCode = 400;
    throw error;
  }

  // Fetch product prices to compute total and ensure consistent pricing
  const productIds = products.map((p) => p.productId);
  const dbProducts = await Product.find({ _id: { $in: productIds } });

  if (dbProducts.length !== products.length) {
    const error = new Error('One or more products not found');
    error.statusCode = 400;
    throw error;
  }

  const productsWithPrice = products.map((item) => {
    const dbProduct = dbProducts.find((p) => p._id.toString() === item.productId);
    const linePrice = dbProduct.price;
    const gstAmount = Math.round(linePrice * GST_RATE) * item.quantity;
    const finalAmount = linePrice * item.quantity + gstAmount;

    return {
      productId: item.productId,
      quantity: item.quantity,
      price: linePrice,
      gstAmount,
      finalAmount
    };
  });

  const totalAmount = productsWithPrice.reduce((sum, item) => sum + item.finalAmount, 0);

  // Reserve stock atomically – ensures stock is only deducted for successful orders
  await reserveStockForOrder(productsWithPrice);

  const baseOrder = {
    user: req.user._id,
    products: productsWithPrice,
    totalAmount,
    status: 'CREATED',
    paymentStatus: 'PAID'
  };

  const order = await Order.create({
    ...baseOrder,
    ...overrides
  });

  return order;
};

const getUserOrders = async (userId) => {
  const orders = await Order.find({ user: userId })
    .populate('products.productId', 'name')
    .sort({ createdAt: -1 });
  return orders;
};

const getAllOrders = async () => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .populate('products.productId', 'name')
    .sort({ createdAt: -1 });
  return orders;
};

const getAdminMetrics = async () => {
  const result = await Order.aggregate([
    { $match: { paymentStatus: 'PAID' } },
    {
      $group: {
        _id: null,
        revenue: { $sum: '$totalAmount' },
        totalOrders: { $sum: 1 }
      }
    }
  ]);

  if (result.length === 0) {
    return { revenue: 0, totalOrders: 0 };
  }

  return {
    revenue: result[0].revenue,
    totalOrders: result[0].totalOrders
  };
};

const updateOrderStatus = async (id, status) => {
  const order = await Order.findById(id);
  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  order.status = status;
  const updated = await order.save();
  return updated;
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getAdminMetrics
};

