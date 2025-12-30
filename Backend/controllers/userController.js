const User = require('../models/User');
const Calculation = require('../models/Calculation');

// GET /api/users/:username
const getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).select('-password -__v');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const calculations = await Calculation.find({ user: user._id }).sort({ createdAt: -1 });

        res.json({ user, calculations });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getUserByUsername };
