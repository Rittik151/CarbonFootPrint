const express = require('express');
const router = express.Router();
const { getUserByUsername } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

// GET /api/users/:username -- protected
router.get('/:username', auth, getUserByUsername);

module.exports = router;
