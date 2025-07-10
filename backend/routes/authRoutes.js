const express = require('express');
const router = express.Router();
const { loginAdmin, getMe, logout } = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginAdmin);
router.get('/me', protect, getMe); // Any authenticated user can access their profile
router.get('/logout', protect, logout); // Any authenticated user can logout

module.exports = router;
