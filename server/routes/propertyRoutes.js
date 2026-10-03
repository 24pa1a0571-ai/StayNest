const express = require('express');
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  getOwnerProperties,
  createProperty,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getProperties);
router.get('/owner/me', protect, authorize('owner'), getOwnerProperties);
router.get('/:id', getPropertyById);
router.post('/', protect, authorize('owner'), createProperty);
router.put('/:id', protect, authorize('owner'), updateProperty);
router.delete('/:id', protect, authorize('owner'), deleteProperty);

module.exports = router;
