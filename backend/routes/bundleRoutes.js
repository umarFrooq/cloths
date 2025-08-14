const express = require('express');
const router = express.Router();
const { getBundles, getBundleById, createBundle } = require('../controllers/bundleController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getBundles)
  .post(protect, authorize('admin'), createBundle); // Only admin can create

router.route('/:id')
  .get(getBundleById);

module.exports = router;
