const User = require('../models/User');
const Calculation = require('../models/Calculation');

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function getMonthNameFromCalculation(calc) {
  const details = calc?.details;
  if (typeof details === 'string' && details.trim()) {
    try {
      const parsed = JSON.parse(details);
      if (parsed?.month && MONTHS.includes(parsed.month)) {
        return parsed.month;
      }
    } catch (_) {
      // Ignore malformed details and fallback to createdAt month.
    }
  }

  const created = new Date(calc?.createdAt || Date.now());
  return MONTHS[created.getMonth()] || MONTHS[0];
}

const getAdminStats = async (req, res) => {
  try {
    const memberFilter = { role: { $ne: 'admin' } };
    const members = await User.find(memberFilter).select('name username email isLoggedIn');

    const totalMembers = members.length;
    const loggedInMembers = members.filter((m) => m.isLoggedIn).length;

    const memberIds = members.map((m) => m._id);
    const calculations = await Calculation.find({ user: { $in: memberIds } }).select(
      'user dataWasted details createdAt'
    );

    const usageByUser = new Map();
    const monthTotalsMap = MONTHS.reduce((acc, month) => {
      acc[month] = 0;
      return acc;
    }, {});

    for (const calc of calculations) {
      const userId = String(calc.user);
      const monthName = getMonthNameFromCalculation(calc);
      const amount = Number(calc.dataWasted || 0);

      if (!usageByUser.has(userId)) {
        usageByUser.set(
          userId,
          MONTHS.reduce((acc, month) => {
            acc[month] = 0;
            return acc;
          }, {})
        );
      }

      const userMonths = usageByUser.get(userId);
      userMonths[monthName] += amount;
      monthTotalsMap[monthName] += amount;
    }

    const users = members.map((member) => {
      const monthMap =
        usageByUser.get(String(member._id)) ||
        MONTHS.reduce((acc, month) => {
          acc[month] = 0;
          return acc;
        }, {});

      const monthwise = MONTHS.map((month) => ({
        month,
        totalKg: Number((monthMap[month] || 0).toFixed(2)),
      }));

      const totalUsageKg = Number(
        monthwise.reduce((sum, item) => sum + item.totalKg, 0).toFixed(2)
      );

      return {
        userId: member._id,
        name: member.name || member.username || member.email,
        username: member.username,
        email: member.email,
        totalUsageKg,
        monthwise,
      };
    });

    users.sort((a, b) => b.totalUsageKg - a.totalUsageKg);

    const monthlyTotals = MONTHS.map((month) => ({
      month,
      totalKg: Number((monthTotalsMap[month] || 0).toFixed(2)),
    }));

    const totalUsageKg = Number(
      monthlyTotals.reduce((sum, item) => sum + item.totalKg, 0).toFixed(2)
    );

    const activeMonths = monthlyTotals.filter((m) => m.totalKg > 0).length;

    res.json({
      totalMembers,
      loggedInMembers,
      totalUsageKg,
      activeMonths,
      monthlyTotals,
      users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAdminStats };
