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

// GET /api/users/leaderboard
const getCommunityLeaderboard = async (req, res) => {
    try {
        const members = await User.find({ role: { $ne: 'admin' } }).select('name username email');
        const memberIds = members.map((m) => m._id);

        const usageSummary = await Calculation.aggregate([
            { $match: { user: { $in: memberIds } } },
            {
                $group: {
                    _id: '$user',
                    totalUsageKg: { $sum: '$dataWasted' },
                    calculationCount: { $sum: 1 },
                },
            },
        ]);

        const usageByUser = new Map();
        for (const item of usageSummary) {
            const totalUsageKg = Number(item.totalUsageKg || 0);
            const calculationCount = Number(item.calculationCount || 0);
            const monthlyUsageKg = calculationCount > 0 ? totalUsageKg / calculationCount : 0;

            usageByUser.set(String(item._id), {
                totalUsageKg: Number(totalUsageKg.toFixed(2)),
                calculationCount,
                monthlyUsageKg: Number(monthlyUsageKg.toFixed(2)),
            });
        }

        const leaderboard = members
            .map((member) => {
                const usage = usageByUser.get(String(member._id));
                return {
                    userId: String(member._id),
                    name: member.name || member.username || member.email,
                    username: member.username,
                    totalUsageKg: usage?.totalUsageKg || 0,
                    monthlyUsageKg: usage?.monthlyUsageKg || 0,
                    calculationCount: usage?.calculationCount || 0,
                };
            })
            .filter((entry) => entry.monthlyUsageKg > 0)
            .sort((a, b) => {
                if (a.monthlyUsageKg !== b.monthlyUsageKg) return a.monthlyUsageKg - b.monthlyUsageKg;
                return a.name.localeCompare(b.name);
            })
            .map((entry, index) => ({ ...entry, rank: index + 1 }));

        const currentUserRank =
            leaderboard.find((entry) => entry.userId === String(req.user.userId))?.rank || null;

        res.json({
            totalMembers: leaderboard.length,
            currentUserRank,
            leaderboard,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getUserByUsername, getCommunityLeaderboard };
