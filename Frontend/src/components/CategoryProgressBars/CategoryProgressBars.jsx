import "./CategoryProgressBars.css";

const CATEGORY_LABELS = {
  electricity: "Electricity",
  gas: "Gas",
  transport: "Transport",
  diet: "Diet",
};

export default function CategoryProgressBars({ breakdown = {}, totalKg = 0 }) {
  const total = Number(totalKg || 0);
  const entries = Object.entries(CATEGORY_LABELS).map(([key, label]) => {
    const value = Number(breakdown?.[key] || 0);
    const percent =
      total > 0 ? Math.max(0, Math.min(100, (value / total) * 100)) : 0;
    return { key, label, value, percent };
  });

  return (
    <section className="contribution-card">
      <h3>Category Contribution</h3>
      <div className="contribution-list">
        {entries.map((item) => (
          <div key={item.key} className="contribution-item">
            <div className="contribution-label-row">
              <span>{item.label}</span>
              <span>{item.percent.toFixed(1)}%</span>
            </div>
            <div className="contribution-track">
              <div
                className="contribution-fill"
                style={{ width: `${item.percent}%` }}
              />
            </div>
            <small>{item.value.toFixed(1)} kg CO2</small>
          </div>
        ))}
      </div>
    </section>
  );
}
