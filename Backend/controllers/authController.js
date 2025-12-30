const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) return res.status(400).json({ msg: 'Please enter all fields' });

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        // Build a sanitized base username from `name` or fallback to email local-part
        const sanitize = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_\-]/g, '');
        const baseFromName = sanitize(name);
        const baseFromEmail = sanitize(email.split('@')[0] || 'user');
        const baseUsername = baseFromName || baseFromEmail || 'user';

        // Ensure username is unique by appending a numeric suffix when necessary
        let username = baseUsername;
        let suffix = 0;
        while (await User.findOne({ username })) {
            suffix += 1;
            username = `${baseUsername}${suffix}`;
        }

        user = new User({ username, name, email, password: hashed, role: role || 'farmer' });
        await user.save();

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, role: user.role, name: user.name, username: user.username, email: user.email });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ msg: 'Please enter all fields' });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, role: user.role, name: user.name, email: user.email });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

module.exports = { register, login };
