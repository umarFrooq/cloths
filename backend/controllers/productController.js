const Product = require('../models/Product');
const Category = require('../models/Category'); // For validating category existence

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin (to be implemented)
exports.createProduct = async (req, res) => {
  try {
    const {
      name_en, name_ar, description_en, description_ar,
      price, category, stock, sku, tags_en, tags_ar, isActive
    } = req.body;

    // Basic validation
    if (!name_en || !name_ar || !description_en || !description_ar || !price || !category || stock === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields: name (en/ar), description (en/ar), price, category, stock.' });
    }

    // Validate category existence
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ success: false, message: `Category with ID ${category} not found.` });
    }

    // TODO: Image handling will be added later with S3 integration
    // For now, req.body.images might be an array of URLs or handled separately
    const images = req.body.images || [];


    const product = new Product({
      name_en, name_ar, description_en, description_ar,
      price, category, stock, sku, tags_en, tags_ar, isActive, images
    });

    const createdProduct = await product.save();
    res.status(201).json({ success: true, data: createdProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    if (error.code === 11000) { // Duplicate key error (e.g. slug or SKU)
        return res.status(400).json({ success: false, message: 'Product with this slug or SKU already exists.', error: error.keyValue });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get all products (with filtering, pagination, sorting)
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude from filtering (like pagination, sort, select)
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Base query - find active products
    let parsedQuery = JSON.parse(queryStr);
    parsedQuery.isActive = parsedQuery.isActive === undefined ? true : parsedQuery.isActive; // Default to active products

    // Language specific search (simple example, can be enhanced)
    // If a 'lang' query param is provided, we might prefer results in that language or search specific fields
    const lang = req.query.lang || 'en'; // Default to English

    // Search term for name/description/tags
    if (req.query.search) {
        const searchTerm = req.query.search;
        const searchRegex = new RegExp(searchTerm, 'i'); // Case-insensitive search

        if (lang === 'ar') {
            parsedQuery.$or = [
                { name_ar: searchRegex },
                { description_ar: searchRegex },
                { tags_ar: searchRegex }
            ];
        } else {
             parsedQuery.$or = [
                { name_en: searchRegex },
                { description_en: searchRegex },
                { tags_en: searchRegex }
            ];
        }
        delete parsedQuery.search; // remove from filter criteria as it's handled by $or
    }


    query = Product.find(parsedQuery).populate('category', 'name_en name_ar'); // Populate category name

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt'); // Default sort by newest
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10; // Default 10 per page
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments(parsedQuery);

    query = query.skip(startIndex).limit(limit);

    const products = await query;

    // Pagination result
    const pagination = {};
    if (endIndex < total) {
      pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts: total,
      pagination,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get a single product by ID or Slug
// @route   GET /api/products/:identifier (ID or slug_en or slug_ar)
// @access  Public
exports.getProductByIdentifier = async (req, res) => {
  try {
    const identifier = req.params.identifier;
    let product;

    // Check if identifier is a valid MongoDB ObjectId
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findOne({ _id: identifier, isActive: true }).populate('category', 'name_en name_ar');
    }

    // If not found by ID, try by slug_en or slug_ar
    if (!product) {
      product = await Product.findOne({
        $or: [{ slug_en: identifier }, { slug_ar: identifier }],
        isActive: true
      }).populate('category', 'name_en name_ar');
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found or not active.' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    if (error.kind === 'ObjectId' && !res.headersSent) { // Check if headersSent to avoid double response
        return res.status(404).json({ success: false, message: 'Product not found (invalid ID format).' });
    }
    if (!res.headersSent) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  }
};


// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin (to be implemented)
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // TODO: Add authorization here to ensure only admin or owner can update
    // For now, S3 image update logic will be placeholder or handled by passing full image arrays

    // Fields that can be updated
    const {
        name_en, name_ar, description_en, description_ar,
        price, category, stock, sku, tags_en, tags_ar, isActive, images
    } = req.body;

    if (category) {
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ success: false, message: `Category with ID ${category} not found.` });
        }
        product.category = category;
    }

    if (name_en) product.name_en = name_en;
    if (name_ar) product.name_ar = name_ar;
    if (description_en) product.description_en = description_en;
    if (description_ar) product.description_ar = description_ar;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (sku) product.sku = sku; // Consider SKU uniqueness if changed
    if (tags_en) product.tags_en = tags_en;
    if (tags_ar) product.tags_ar = tags_ar;
    if (isActive !== undefined) product.isActive = isActive;
    if (images) product.images = images; // Replace images array. More sophisticated logic for S3 needed.

    // Slugs will be updated by pre-save middleware if names change
    if (name_en && name_en !== product.name_en) product.slug_en = undefined; // force regeneration
    if (name_ar && name_ar !== product.name_ar) product.slug_ar = undefined; // force regeneration


    const updatedProduct = await product.save();
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    if (error.code === 11000) {
        return res.status(400).json({ success: false, message: 'Update failed. Product with this slug or SKU already exists.', error: error.keyValue });
    }
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ success: false, message: 'Product not found (invalid ID).' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin (to be implemented)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // TODO: S3 Image Deletion Logic will go here
    // For each image in product.images, delete from S3.

    await product.deleteOne(); // Changed from .remove()

    res.status(200).json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ success: false, message: 'Product not found (invalid ID).' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
