const express = require('express');
const { getUserProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const router = express.Router();

router.get('/profile', protect, authorize('User', 'Admin'), getUserProfile);

module.exports = router;
