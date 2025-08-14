const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  address: {
    type: String,
    required: [true, 'Address line is required.'],
    trim: true,
  },
  street: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City is required.'],
    trim: true,
  },
  postalCode: {
    type: String,
    required: [true, 'Postal code is required.'],
    trim: true,
  },
  country: {
    type: String,
    required: [true, 'Country is required.'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required.'],
    trim: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

module.exports = AddressSchema;
// We are exporting the schema itself, not a model, because it will be a sub-document in the User model.
// If you wanted a separate collection for addresses, you would use:
// module.exports = mongoose.model('Address', AddressSchema);
