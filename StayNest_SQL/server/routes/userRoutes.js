const express = require('express');
const router = express.Router();
const { updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.put('/me', protect, updateProfile);

module.exports = router;
