export const EMISSION_FACTORS = {
  ELECTRICITY: 0.92,
  GAS: 2.2,
  CAR: 2.4,
  FLIGHTS: 90,
  DIET: {
    vegan: 800,
    vegetarian: 1000,
    average: 1200,
    none: 0,
  },
};

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const TREND_STORAGE_KEY = "carbonAware.monthlyTrend.v1";

export function calculateMonthlyCarbon(inputs) {
  const electricityKg = Number(inputs?.electricity || 0) * EMISSION_FACTORS.ELECTRICITY;
  const gasKg = Number(inputs?.gas || 0) * EMISSION_FACTORS.GAS;
  const transportKg =
    (Number(inputs?.carMileage || 0) * EMISSION_FACTORS.CAR +
      Number(inputs?.flights || 0) * EMISSION_FACTORS.FLIGHTS) /
    12;
  const annualDiet = EMISSION_FACTORS.DIET[inputs?.diet || "none"] || 0;
  const dietKg = annualDiet / 12;

  const rawTotal = electricityKg + gasKg + transportKg + dietKg;

  return {
    totalKg: Math.round(rawTotal),
    breakdown: {
      electricity: Number(electricityKg.toFixed(2)),
      gas: Number(gasKg.toFixed(2)),
      transport: Number(transportKg.toFixed(2)),
      diet: Number(dietKg.toFixed(2)),
    },
  };
}

export function getEquivalencyMetrics(totalKg) {
  const value = Number(totalKg || 0);

  return {
    treeSeedlings: Math.round(value / 39),
    milesDriven: Math.round(value / 0.404),
    smartphonesCharged: Math.round(value / 0.00822),
  };
}

function safeParseTrend() {
  try {
    const raw = localStorage.getItem(TREND_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function toPeriodKey(year, monthIndex) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

export function saveMonthlyTotal({ totalKg, monthName, year }) {
  const monthIndex = MONTHS.indexOf(monthName);
  const now = new Date();
  const resolvedMonthIndex = monthIndex === -1 ? now.getMonth() : monthIndex;
  const resolvedYear = Number(year || now.getFullYear());
  const periodKey = toPeriodKey(resolvedYear, resolvedMonthIndex);

  const existing = safeParseTrend().filter((item) => item?.periodKey !== periodKey);
  const next = [
    ...existing,
    {
      periodKey,
      monthName: MONTHS[resolvedMonthIndex],
      year: resolvedYear,
      totalKg: Math.round(Number(totalKg || 0)),
      savedAt: new Date().toISOString(),
    },
  ];

  localStorage.setItem(TREND_STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function getLastSixMonthsTrend(goalKg = 500) {
  const map = new Map();
  for (const item of safeParseTrend()) {
    if (item?.periodKey) map.set(item.periodKey, Number(item.totalKg || 0));
  }

  const now = new Date();
  const labels = [];
  const totals = [];

  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = toPeriodKey(d.getFullYear(), d.getMonth());
    labels.push(`${MONTHS[d.getMonth()].slice(0, 3)} ${String(d.getFullYear()).slice(-2)}`);
    totals.push(map.get(key) || 0);
  }

  return {
    labels,
    totals,
    goal: labels.map(() => Number(goalKg)),
  };
}

function parseMonthIndex(monthName) {
  if (!monthName) return -1;
  const normalized = String(monthName).trim().toLowerCase();
  return MONTHS.findIndex((m) => m.toLowerCase() === normalized);
}

function getPeriodFromCalculation(calc) {
  const createdAt = new Date(calc?.createdAt || Date.now());
  let monthIndex = createdAt.getMonth();
  let year = createdAt.getFullYear();

  try {
    const details = typeof calc?.details === "string"
      ? JSON.parse(calc.details)
      : calc?.details;
    const detailMonthIdx = parseMonthIndex(details?.month || details?.Month);
    if (detailMonthIdx >= 0) monthIndex = detailMonthIdx;

    const detailYear = Number(details?.year || details?.Year);
    if (Number.isFinite(detailYear) && detailYear > 1900) {
      year = detailYear;
    }
  } catch {
    // Keep createdAt fallback when details are not valid JSON.
  }

  return toPeriodKey(year, monthIndex);
}

export function getLastSixMonthsTrendWithHistory(calculations = [], goalKg = 500) {
  const localMap = new Map();
  for (const item of safeParseTrend()) {
    if (item?.periodKey) {
      localMap.set(item.periodKey, Number(item.totalKg || 0));
    }
  }

  const latestByPeriod = new Map();
  for (const calc of calculations) {
    const periodKey = getPeriodFromCalculation(calc);
    const calcTime = new Date(calc?.createdAt || 0).getTime();
    const prev = latestByPeriod.get(periodKey);
    if (!prev || calcTime > prev.time) {
      latestByPeriod.set(periodKey, {
        time: calcTime,
        total: Number(calc?.dataWasted || 0),
      });
    }
  }

  const mergedMap = new Map(localMap);
  for (const [periodKey, value] of latestByPeriod.entries()) {
    mergedMap.set(periodKey, value.total);
  }

  const now = new Date();
  const labels = [];
  const totals = [];

  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = toPeriodKey(d.getFullYear(), d.getMonth());
    labels.push(`${MONTHS[d.getMonth()].slice(0, 3)} ${String(d.getFullYear()).slice(-2)}`);
    totals.push(mergedMap.get(key) || 0);
  }

  return {
    labels,
    totals,
    goal: labels.map(() => Number(goalKg)),
  };
}

export function getHistoricalSummary(calculations = []) {
  const totalKg = calculations.reduce((sum, calc) => {
    return sum + Number(calc?.dataWasted || 0);
  }, 0);

  const breakdown = {
    electricity: 0,
    gas: 0,
    transport: 0,
    diet: 0,
  };

  for (const calc of calculations) {
    try {
      const details = typeof calc?.details === "string"
        ? JSON.parse(calc.details)
        : calc?.details;
      const computed = calculateMonthlyCarbon(details || {});
      breakdown.electricity += Number(computed.breakdown.electricity || 0);
      breakdown.gas += Number(computed.breakdown.gas || 0);
      breakdown.transport += Number(computed.breakdown.transport || 0);
      breakdown.diet += Number(computed.breakdown.diet || 0);
    } catch {
      // Ignore malformed details and keep processing the rest.
    }
  }

  return {
    totalKg: Math.round(totalKg),
    breakdown: {
      electricity: Number(breakdown.electricity.toFixed(2)),
      gas: Number(breakdown.gas.toFixed(2)),
      transport: Number(breakdown.transport.toFixed(2)),
      diet: Number(breakdown.diet.toFixed(2)),
    },
  };
}
