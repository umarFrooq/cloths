const Bundle = require('../models/Bundle');
const { ErrorResponse } = require('../middleware/errorHandler');

// @desc    Get all active bundle deals
// @route   GET /api/bundles
// @access  Public
exports.getBundles = async (req, res, next) => {
  try {
    const bundles = await Bundle.find({ isActive: true }).populate({
        path: 'products',
        select: 'name_en name_ar price images' // Select fields to return for products
    });
    res.status(200).json({ success: true, count: bundles.length, data: bundles });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single bundle deal by ID
// @route   GET /api/bundles/:id
// @access  Public
exports.getBundleById = async (req, res, next) => {
  try {
    const bundle = await Bundle.findById(req.params.id).populate({
        path: 'products',
        populate: { path: 'category' } // Example of nested populate if needed
    });

    if (!bundle) {
      return next(new ErrorResponse(`Bundle not found with id of ${req.params.id}`, 404));
    }
    if (!bundle.isActive) {
        return next(new ErrorResponse(`Bundle is not active`, 404));
    }

    res.status(200).json({ success: true, data: bundle });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new bundle deal
// @route   POST /api/bundles
// @access  Private/Admin
exports.createBundle = async (req, res, next) => {
    // Implementation for admin to create bundles
    // For now, we assume bundles are created directly in the DB or via a dedicated admin panel
    res.status(501).json({ success: false, message: 'Not Implemented' });
};
