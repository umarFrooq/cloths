const express = require('express');
const router = express.Router();
const {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} = require('../controllers/addressController');

const { protect } = require('../middleware/authMiddleware');

// All routes here are protected
router.use(protect);

router.route('/')
  .get(getAddresses)
  .post(addAddress);

router.route('/:id')
  .put(updateAddress)
  .delete(deleteAddress);

module.exports = router;
