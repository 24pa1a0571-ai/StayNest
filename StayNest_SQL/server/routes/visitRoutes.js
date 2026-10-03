const express = require('express');
const router = express.Router();
const {
  createVisitRequest,
  getMyVisits,
  getOwnerVisits,
  updateVisitStatus
} = require('../controllers/visitController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createVisitRequest);
router.get('/my', protect, getMyVisits);
router.get('/owner', protect, authorize('owner'), getOwnerVisits);
router.patch('/:id/status', protect, authorize('owner'), updateVisitStatus);

module.exports = router;
