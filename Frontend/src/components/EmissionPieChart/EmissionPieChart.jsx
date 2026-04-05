import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import './EmissionPieChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function EmissionPieChart({ breakdown }) {
  const data = {
    labels: ["Electricity", "Gas", "Transport", "Diet"],
    datasets: [
      {
        data: [
          Number(breakdown?.electricity || 0),
          Number(breakdown?.gas || 0),
          Number(breakdown?.transport || 0),
          Number(breakdown?.diet || 0),
        ],
        backgroundColor: ["#dc2626", "#f59e0b", "#84cc16", "#16a34a"],
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "58%",
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1100,
      easing: "easeOutCubic",
    },
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw} kg CO2`,
        },
      },
    },
  };

  return (
    <div className="chart-card">
      <h3>Category Breakdown (Donut)</h3>
      <div className="chart-wrap">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
