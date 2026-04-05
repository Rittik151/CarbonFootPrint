import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../api";
import UserCalculations from "../../components/UserCalculations/UserCalculations";
import ResultsDashboard from "../../components/ResultsDashboard/ResultsDashboard";
import "./Dashboard.css";
import {
  MONTHS,
  calculateMonthlyCarbon,
  getHistoricalSummary,
  getLastSixMonthsTrendWithHistory,
} from "../../utils/carbonMetrics";

const Dashboard = () => {
  const { username, name, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedReportPeriod, setSelectedReportPeriod] = useState("");

  useEffect(() => {
    if (role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [role, navigate]);

  useEffect(() => {
    let mounted = true;

    const fetchCalculationsOnly = async () => {
      try {
        const calcRes = await api.get("/calculations");
        if (!mounted) return;
        setCalculations(calcRes.data || []);
      } catch (err) {
        if (!mounted) return;
        setError(
          err?.response?.data?.message ||
            err?.response?.data?.msg ||
            "Failed to load dashboard",
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (!username) {
      setLoading(true);
      fetchCalculationsOnly();
      return () => {
        mounted = false;
      };
    }

    setLoading(true);
    api
      .get(`/users/${encodeURIComponent(username)}`)
      .then((res) => {
        if (!mounted) return;
        setProfile(res.data.user);
        setCalculations(res.data.calculations || []);
      })
      .catch(async () => {
        await fetchCalculationsOnly();
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [username]);

  const totalData = calculations.reduce((s, c) => s + (c.dataWasted || 0), 0);
  const trend = getLastSixMonthsTrendWithHistory(calculations, 500);
  const historicalSummary = getHistoricalSummary(calculations);
  const averagePerMonth = calculations.length
    ? historicalSummary.totalKg / calculations.length
    : 0;

  const calculationsByLatest = [...calculations].sort((a, b) => {
    const aTime = new Date(a?.createdAt || 0).getTime();
    const bTime = new Date(b?.createdAt || 0).getTime();
    return bTime - aTime;
  });

  const parseMonthIndex = (monthValue) => {
    const normalized = String(monthValue || "")
      .trim()
      .toLowerCase();
    return MONTHS.findIndex((m) => m.toLowerCase() === normalized);
  };

  const monthlyReports = useMemo(() => {
    const reportsMap = new Map();

    for (const calc of calculationsByLatest) {
      const createdAt = new Date(calc?.createdAt || Date.now());
      let monthIndex = createdAt.getMonth();
      let year = createdAt.getFullYear();
      let parsedDetails = null;

      try {
        parsedDetails =
          typeof calc?.details === "string"
            ? JSON.parse(calc.details)
            : calc?.details;
      } catch {
        parsedDetails = null;
      }

      const detailsMonthIndex = parseMonthIndex(
        parsedDetails?.month || parsedDetails?.Month,
      );
      if (detailsMonthIndex >= 0) {
        monthIndex = detailsMonthIndex;
      }

      const detailsYear = Number(parsedDetails?.year || parsedDetails?.Year);
      if (Number.isFinite(detailsYear) && detailsYear > 1900) {
        year = detailsYear;
      }

      const key = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
      if (!reportsMap.has(key)) {
        reportsMap.set(key, {
          key,
          year,
          monthIndex,
          monthName: MONTHS[monthIndex],
          totalWasted: 0,
          calculations: [],
        });
      }

      const report = reportsMap.get(key);
      report.totalWasted += Number(calc?.dataWasted || 0);

      let breakdown = null;
      if (parsedDetails) {
        try {
          breakdown = calculateMonthlyCarbon(parsedDetails).breakdown;
        } catch {
          breakdown = null;
        }
      }

      report.calculations.push({
        id: calc?._id || `${key}-${createdAt.getTime()}`,
        createdAt,
        dataWasted: Number(calc?.dataWasted || 0),
        details: parsedDetails,
        breakdown,
      });
    }

    return [...reportsMap.values()]
      .map((report) => ({
        ...report,
        totalWasted: Number(report.totalWasted.toFixed(2)),
        calculations: report.calculations.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        ),
      }))
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.monthIndex - a.monthIndex;
      });
  }, [calculationsByLatest]);

  useEffect(() => {
    if (!monthlyReports.length) {
      setSelectedReportPeriod("");
      return;
    }

    if (!selectedReportPeriod) {
      setSelectedReportPeriod(monthlyReports[0].key);
      return;
    }

    const exists = monthlyReports.some(
      (report) => report.key === selectedReportPeriod,
    );
    if (!exists) {
      setSelectedReportPeriod(monthlyReports[0].key);
    }
  }, [monthlyReports, selectedReportPeriod]);

  const selectedMonthlyReport =
    monthlyReports.find((report) => report.key === selectedReportPeriod) ||
    null;

  const latestCalculation = calculationsByLatest[0] || null;
  let latestBreakdown = { electricity: 0, gas: 0, transport: 0, diet: 0 };
  let latestTotal = Number(latestCalculation?.dataWasted || 0);

  if (latestCalculation) {
    try {
      const details =
        typeof latestCalculation.details === "string"
          ? JSON.parse(latestCalculation.details)
          : latestCalculation.details;
      const computed = calculateMonthlyCarbon(details || {});
      latestBreakdown = computed.breakdown;
      if (!latestTotal) latestTotal = computed.totalKg;
    } catch {
      latestBreakdown = { electricity: 0, gas: 0, transport: 0, diet: 0 };
    }
  }

  // derive diet label from the most recent calculation's details (if provided)
  const dietMap = {
    average: "Average Meat Eater",
    vegetarian: "Vegetarian",
    vegan: "Vegan",
    none: "None",
  };
  let dietLabel = "—";
  if (calculations.length > 0) {
    try {
      const latest = calculationsByLatest[0];
      const details =
        typeof latest.details === "string"
          ? JSON.parse(latest.details)
          : latest.details;
      const diet = details?.diet || details?.Diet || null;
      dietLabel = dietMap[diet] || (diet ? String(diet) : "—");
    } catch (e) {
      dietLabel = "—";
    }
  }

  return (
    <>
      <Header />
      <main className="dashboard-page">
        <div className="container">
          <h1>
            {loading
              ? "Loading..."
              : `Welcome ${profile?.name || profile?.username || name || ""}`}
          </h1>

          {error && <div style={{ color: "crimson" }}>{error}</div>}

          <div className="dashboard-tip">
            Tip: Focus first on your highest category from the breakdown to get
            the fastest reduction.
          </div>

          <div className="dashboard-content">
            <div className="stats-card">
              <h3>Total Calculations</h3>
              <p className="stat-value">{calculations.length}</p>
              <p className="stat-comparison">Recent calculations shown below</p>
            </div>
            <div className="stats-card">
              <h3>Total Data Wasted</h3>
              <p className="stat-value">{totalData} kg CO2</p>
              <p className="stat-comparison">
                Sum of dataWasted from your calculations
              </p>
            </div>
            {/* <div className="stats-card">
              <h3>Role</h3>
              <p className="stat-value">{profile?.role || '—'}</p>
              <p className="stat-comparison">Account role</p>
            </div> */}
            <div className="stats-card">
              <h3>Diet Type (latest)</h3>
              <p className="stat-value">{dietLabel}</p>
              <p className="stat-comparison">
                From your most recent calculation
              </p>
            </div>
          </div>

          <section className="monthly-report-section">
            <div className="monthly-report-header">
              <h2>Monthly Report</h2>
              <label>
                Select Month
                <select
                  value={selectedReportPeriod}
                  onChange={(e) => setSelectedReportPeriod(e.target.value)}
                  disabled={!monthlyReports.length}
                >
                  {monthlyReports.length ? (
                    monthlyReports.map((report) => (
                      <option key={report.key} value={report.key}>
                        {report.monthName} {report.year}
                      </option>
                    ))
                  ) : (
                    <option value="">No report available</option>
                  )}
                </select>
              </label>
            </div>

            {selectedMonthlyReport ? (
              <>
                <div className="monthly-report-cards">
                  <article className="monthly-report-card">
                    <h3>
                      {selectedMonthlyReport.monthName}{" "}
                      {selectedMonthlyReport.year}
                    </h3>
                    <p className="monthly-report-value">
                      {selectedMonthlyReport.totalWasted.toLocaleString()} kg
                      CO2
                    </p>
                    <p className="monthly-report-note">
                      Total wasted data for selected month
                    </p>
                  </article>

                  <article className="monthly-report-card">
                    <h3>Your Details</h3>
                    <p className="monthly-report-note">
                      Name: {profile?.name || name || "-"}
                    </p>
                    <p className="monthly-report-note">
                      Username: {profile?.username || username || "-"}
                    </p>
                    <p className="monthly-report-note">
                      Calculations: {selectedMonthlyReport.calculations.length}
                    </p>
                  </article>
                </div>

                <div className="monthly-report-table-wrap">
                  <table className="monthly-report-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Wasted Data (kg CO2)</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedMonthlyReport.calculations.map((entry) => (
                        <tr key={entry.id}>
                          <td>{entry.createdAt.toLocaleDateString()}</td>
                          <td>{entry.dataWasted.toLocaleString()}</td>
                          <td>
                            {entry.breakdown ? (
                              <span>
                                E: {entry.breakdown.electricity}, G:{" "}
                                {entry.breakdown.gas}, T:{" "}
                                {entry.breakdown.transport}, D:{" "}
                                {entry.breakdown.diet}
                              </span>
                            ) : (
                              <span>No details</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <p className="monthly-report-empty">
                No monthly report available yet. Add a calculation to generate
                your report.
              </p>
            )}
          </section>

          <UserCalculations
            calculations={calculations.length ? calculations : undefined}
          />

          <ResultsDashboard
            totalKg={historicalSummary.totalKg || latestTotal}
            averageKgPerMonth={averagePerMonth}
            breakdown={historicalSummary.breakdown}
            trend={trend}
          />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Dashboard;
