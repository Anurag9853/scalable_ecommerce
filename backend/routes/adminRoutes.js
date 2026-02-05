const express = require('express');
const { body } = require('express-validator');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getAllOrdersForAdmin,
  updateOrderStatusForAdmin
} = require('../controllers/orderController');
const {
  createNewProduct,
  updateExistingProduct,
  removeProduct,
  getLowStock
} = require('../controllers/productController');
const { getAdminMetrics } = require('../services/orderService');

const router = express.Router();

// All admin routes are protected and require ADMIN role
router.use(protect, admin);

// Orders
router.get('/orders', getAllOrdersForAdmin);

router.get('/metrics', async (req, res, next) => {
  try {
    const metrics = await getAdminMetrics();
    res.json(metrics);
  } catch (err) {
    next(err);
  }
});

router.patch(
  '/orders/:id/status',
  [body('status').isIn(['CREATED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'])],
  updateOrderStatusForAdmin
);

// Products management
router.post(
  '/products',
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
  '/products/:id',
  [
    body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be 0 or more')
  ],
  updateExistingProduct
);

router.delete('/products/:id', removeProduct);

// Low-stock products
router.get('/products/low-stock', getLowStock);

module.exports = router;

