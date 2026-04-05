import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import './MonthlyTrendChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

export default function MonthlyTrendChart({ trend }) {
  const data = {
    labels: trend?.labels || [],
    datasets: [
      {
        label: "Monthly CO2 (kg)",
        data: trend?.totals || [],
        borderColor: "#2f855a",
        backgroundColor: "rgba(47, 133, 90, 0.15)",
        fill: true,
        tension: 0.3,
        pointRadius: 4,
      },
      {
        label: "Goal Limit (kg)",
        data: trend?.goal || [],
        borderColor: "#dd6b20",
        borderDash: [6, 6],
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "kg CO2",
        },
      },
    },
  };

  return (
    <div className="chart-card">
      <h3>Monthly Trend (Last 6 Months)</h3>
      <div className="chart-wrap">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
