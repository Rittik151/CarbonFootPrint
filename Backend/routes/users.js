const express = require('express');
const router = express.Router();
const { getUserByUsername, getCommunityLeaderboard } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

// GET /api/users/leaderboard -- protected
router.get('/leaderboard', auth, getCommunityLeaderboard);

// GET /api/users/:username -- protected
router.get('/:username', auth, getUserByUsername);

module.exports = router;
