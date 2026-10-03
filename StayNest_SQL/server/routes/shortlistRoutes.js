const express = require('express');
const router = express.Router();
const { getShortlist, addToShortlist, removeFromShortlist } = require('../controllers/shortlistController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getShortlist);
router.post('/:propertyId', protect, addToShortlist);
router.delete('/:propertyId', protect, removeFromShortlist);

module.exports = router;
