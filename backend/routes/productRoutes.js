const express = require('express');
const { body } = require('express-validator');
const {
  getAllProducts,
  getSingleProduct,
  createNewProduct,
  updateExistingProduct,
  removeProduct
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public product listing and details
// Supports query params:
// - search: matches name, category, targetUser (case-insensitive)
// - category: exact category filter
// - sort: price_asc | price_desc
router.get('/', getAllProducts);
router.get('/:id', getSingleProduct);

// Admin product management
router.post(
  '/',
  protect,
  admin,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be 0 or more'),
    body('category').notEmpty().withMessage('Category is required')
  ],
  createNewProduct
);

router.put(
  '/:id',
  protect,
  admin,
  [
    body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be 0 or more')
  ],
  updateExistingProduct
);

router.delete('/:id', protect, admin, removeProduct);

module.exports = router;

