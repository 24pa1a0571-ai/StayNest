const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  updateBookingStatus
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/owner', protect, authorize('owner'), getOwnerBookings);
router.patch('/:id/status', protect, authorize('owner'), updateBookingStatus);

module.exports = router;
