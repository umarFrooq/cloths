const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BundleSchema = new Schema({
  name_en: {
    type: String,
    required: [true, 'English bundle name is required.'],
    trim: true,
    unique: true,
  },
  name_ar: {
    type: String,
    required: [true, 'Arabic bundle name is required.'],
    trim: true,
    unique: true,
  },
  description_en: {
    type: String,
    trim: true,
  },
  description_ar: {
    type: String,
    trim: true,
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  }],
  bundlePrice: {
    type: Number,
    required: [true, 'Bundle price is required.'],
    min: [0, 'Price cannot be negative.'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  image: { // Optional: A specific image for the bundle deal
    type: String,
  },
}, {
  timestamps: true,
});

BundleSchema.index({ name_en: 1 });
BundleSchema.index({ isActive: 1 });

module.exports = mongoose.model('Bundle', BundleSchema);
