const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required.'],
    unique: true,
    trim: true,
  },
  email: { // Optional, but good for password recovery or notifications
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email.',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    minlength: [6, 'Password must be at least 6 characters long.'],
    select: false, // Do not return password by default when querying users
  },
  role: {
    type: String,
    enum: ['admin', 'editor'], // Example roles
    default: 'editor',
  },
  // You might add fields like:
  // firstName: { type: String, trim: true },
  // lastName: { type: String, trim: true },
  // isActive: { type: Boolean, default: true }, // To disable user accounts
}, {
  timestamps: true,
});

// Encrypt password using bcrypt before saving
UserSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) {
    return next();
  }

  // Generate a salt
  const salt = await bcrypt.genSalt(10);
  // Hash the password with the salt
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Note: JWT generation is typically handled in auth controllers, not directly in the model.
// However, you could add a method here to sign a JWT if you prefer that pattern,
// but it might make the model less focused.
// Example:
// UserSchema.methods.getSignedJwtToken = function() {
//   return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE || '30d',
//   });
// };

module.exports = mongoose.model('User', UserSchema);
