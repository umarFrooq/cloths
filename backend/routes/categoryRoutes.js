const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.route('/')
  .get(getCategories)
  // .post(protect, authorize('admin', 'editor'), createCategory); // Temporarily disabled for initial testing
  .post(createCategory); // Allow direct access for initial testing

router.route('/:id')
  .get(getCategoryById)
  .put(protect, authorize('admin', 'editor'), updateCategory) // Allow admin or editor to update
  .delete(protect, authorize('admin'), deleteCategory); // Only admin can delete

module.exports = router;
