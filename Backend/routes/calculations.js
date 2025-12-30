const express = require('express');
const router = express.Router();
const Calculation = require('../models/Calculation');
const auth = require('../middleware/authMiddleware');

// POST /api/calculations - create a new calculation (protected)
router.post('/', auth, async (req, res) => {
    try {
        const { dataWasted, details } = req.body;
        if (typeof dataWasted !== 'number') return res.status(400).json({ message: 'dataWasted must be a number' });

        const calc = new Calculation({ user: req.user.userId, dataWasted, details });
        await calc.save();
        res.status(201).json(calc);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/calculations - get user's calculations (protected)
router.get('/', auth, async (req, res) => {
    try {
        const items = await Calculation.find({ user: req.user.userId }).sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
