const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const { getAdminStats } = require('../controllers/adminController');

router.get('/stats', auth, adminOnly, getAdminStats);

module.exports = router;
