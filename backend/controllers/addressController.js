const User = require('../models/User');

// @desc    Get all addresses for a user
// @route   GET /api/addresses
// @access  Private
exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Add a new address for a user
// @route   POST /api/addresses
// @access  Private
exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const newAddress = req.body;

    // If this is the first address, make it the default
    if (user.addresses.length === 0) {
      newAddress.isDefault = true;
    }

    // If adding a new default address, unset the old default
    if (newAddress.isDefault) {
        user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push(newAddress);
    await user.save();
    res.status(201).json({ success: true, data: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Update an existing address
// @route   PUT /api/addresses/:id
// @access  Private
exports.updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const addressId = req.params.id;
    const updatedAddressData = req.body;

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    // If updating to be the new default, unset the old default
    if (updatedAddressData.isDefault && !address.isDefault) {
        user.addresses.forEach(addr => addr.isDefault = false);
    }

    address.set(updatedAddressData);
    await user.save();
    res.status(200).json({ success: true, data: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Delete an address
// @route   DELETE /api/addresses/:id
// @access  Private
exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const addressId = req.params.id;

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    address.remove();
    await user.save();
    res.status(200).json({ success: true, data: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
