const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { register, login, adminLogin, logout } = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/admin/login
router.post('/admin/login', adminLogin);

// POST /api/auth/logout
router.post('/logout', auth, logout);

module.exports = router;
