const express = require('express');
const { body } = require('express-validator');
const { placeOrder, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// User places order after successful payment simulation on frontend
router.post(
  '/',
  protect,
  [
    body('products')
      .isArray({ min: 1 })
      .withMessage('Products must be a non-empty array'),
    body('products.*.productId').notEmpty().withMessage('productId is required'),
    body('products.*.quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be at least 1')
  ],
  placeOrder
);

// Get orders for logged in user
router.get('/my', protect, getMyOrders);

module.exports = router;

