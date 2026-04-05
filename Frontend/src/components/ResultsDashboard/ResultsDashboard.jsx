import EmissionPieChart from "../EmissionPieChart/EmissionPieChart";
import MonthlyTrendChart from "../MonthlyTrendChart/MonthlyTrendChart";
import ImpactCards from "../ImpactCards/ImpactCards";
import CategoryProgressBars from "../CategoryProgressBars/CategoryProgressBars";
import './ResultsDashboard.css';

function getFootprintLevel(totalKg) {
  const value = Number(totalKg || 0);
  if (value <= 300) return { label: "Low", className: "level-low" };
  if (value <= 700) return { label: "Moderate", className: "level-moderate" };
  return { label: "High", className: "level-high" };
}

export default function ResultsDashboard({
  totalKg = 0,
  averageKgPerMonth,
  breakdown,
  trend,
}) {
  const level = getFootprintLevel(totalKg);
  const averageMonthly = Number(
    averageKgPerMonth !== undefined ? averageKgPerMonth : totalKg,
  );

  return (
    <section className="results-dashboard">
      <div className={`results-total ${level.className}`}>
        <p>Total Carbon Footprint</p>
        <h2>{Number(totalKg || 0).toLocaleString()} kg CO2</h2>
        <p className="results-average">
          Average per month: {Math.round(averageMonthly).toLocaleString()} kg
          CO2
        </p>
        <span className="level-chip">{level.label} Impact</span>
      </div>

      <div className="results-charts-grid">
        <EmissionPieChart breakdown={breakdown} />
        <MonthlyTrendChart trend={trend} />
      </div>

      <CategoryProgressBars breakdown={breakdown} totalKg={totalKg} />

      <ImpactCards totalKg={totalKg} />
    </section>
  );
}
