const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductByIdentifier,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes for getting products
router.route('/')
  .get(getProducts)
  .post(protect, authorize('admin', 'editor'), createProduct); // Allow admin or editor to create

router.route('/:identifier') // Can be ID or slug
  .get(getProductByIdentifier)
  .put(protect, authorize('admin', 'editor'), updateProduct) // Allow admin or editor to update
  .delete(protect, authorize('admin'), deleteProduct); // Only admin can delete


module.exports = router;
