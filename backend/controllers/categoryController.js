const Category = require('../models/Category');

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin (to be implemented)
exports.createCategory = async (req, res) => {
  try {
    const { name_en, name_ar } = req.body;

    if (!name_en || !name_ar) {
      return res.status(400).json({ success: false, message: 'English and Arabic names are required.' });
    }

    // Check if category already exists
    let category = await Category.findOne({ $or: [{ name_en }, { name_ar }] });
    if (category) {
      return res.status(400).json({ success: false, message: 'Category with this name already exists.' });
    }

    category = new Category({ name_en, name_ar });
    await category.save();

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name_en: 1 }); // Sort by English name
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get a single category by ID
// @route   GET /api/categories/:id
// @access  Public
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ success: false, message: 'Category not found (invalid ID).' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin (to be implemented)
exports.updateCategory = async (req, res) => {
  try {
    const { name_en, name_ar } = req.body;
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    // Check for duplicate names if names are being changed
    if (name_en && name_en !== category.name_en) {
      const existing = await Category.findOne({ name_en });
      if (existing && existing._id.toString() !== req.params.id) {
        return res.status(400).json({ success: false, message: `Category with English name '${name_en}' already exists.` });
      }
      category.name_en = name_en;
    }
    if (name_ar && name_ar !== category.name_ar) {
      const existing = await Category.findOne({ name_ar });
      if (existing && existing._id.toString() !== req.params.id) {
        return res.status(400).json({ success: false, message: `Category with Arabic name '${name_ar}' already exists.` });
      }
      category.name_ar = name_ar;
    }

    // Only update fields that were actually passed
    if (req.body.name_en) category.name_en = req.body.name_en;
    if (req.body.name_ar) category.name_ar = req.body.name_ar;


    const updatedCategory = await category.save();
    res.status(200).json({ success: true, data: updatedCategory });
  } catch (error) {
    console.error('Error updating category:', error);
     if (error.kind === 'ObjectId') {
        return res.status(404).json({ success: false, message: 'Category not found (invalid ID).' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin (to be implemented)
// Note: Consider implications: What happens to products in this category?
// Option 1: Disallow deletion if products exist.
// Option 2: Set category to null/default for products.
// Option 3: Delete products (cascade - dangerous).
// For now, simple deletion. Add product check later if needed.
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    // TODO: Add check here: if there are products associated with this category, prevent deletion or handle accordingly.
    // const productsInCategory = await Product.countDocuments({ category: req.params.id });
    // if (productsInCategory > 0) {
    //   return res.status(400).json({ success: false, message: 'Cannot delete category. It has associated products.' });
    // }

    await category.deleteOne(); // Changed from .remove() which is deprecated

    res.status(200).json({ success: true, message: 'Category deleted successfully.' });
  } catch (error) {
    console.error('Error deleting category:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ success: false, message: 'Category not found (invalid ID).' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
