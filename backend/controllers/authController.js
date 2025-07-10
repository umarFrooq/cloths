const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // To access JWT_SECRET

// @desc    Login admin user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password.' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password'); // Explicitly select password

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials (password mismatch).' });
    }

    // User is valid, create token
    sendTokenResponse(user, 200, res);

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private (to be implemented with auth middleware)
exports.getMe = async (req, res) => {
  try {
    // req.user will be set by the auth middleware
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Ensure only relevant roles can access if needed, though middleware should handle this.
    // For example, if only 'admin' or 'editor' roles from User model are allowed for admin panel.
    // if(!['admin', 'editor'].includes(user.role)) {
    //    return res.status(403).json({ success: false, message: 'User role not authorized for this resource.' });
    // }


    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


// Helper function to create JWT, set cookie, and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d', // e.g., '30d', '1h'
  });

  const options = {
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE_DAYS || 30) * 24 * 60 * 60 * 1000) // Cookie expiry
    ),
    httpOnly: true, // Cookie cannot be accessed by client-side scripts
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true; // Only send cookie over HTTPS in production
  }

  res
    .status(statusCode)
    .cookie('token', token, options) // Set cookie (optional, can also just send token in response body)
    .json({
      success: true,
      token, // Also send token in response body for flexibility
      user: { // Send some user details
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
      }
    });
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private (User needs to be logged in to log out)
exports.logout = async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000), // expire in 10 seconds
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
};
