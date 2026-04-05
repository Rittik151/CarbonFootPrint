import { FaTree, FaCarSide, FaMobileScreenButton } from "react-icons/fa6";
import { getEquivalencyMetrics } from "../../utils/carbonMetrics";
import './ImpactCards.css';

export default function ImpactCards({ totalKg = 0 }) {
  const metrics = getEquivalencyMetrics(totalKg);
  const carTripsAvoided = Math.round(metrics.milesDriven / 12);

  const cards = [
    {
      label: "Tree Seedlings (10 years)",
      value: metrics.treeSeedlings,
      icon: <FaTree aria-hidden="true" />,
    },
    {
      label: "Miles Driven (Passenger Car)",
      value: metrics.milesDriven,
      icon: <FaCarSide aria-hidden="true" />,
    },
    {
      label: "Car Trips Avoided (12 mi/trip)",
      value: carTripsAvoided,
      icon: <FaCarSide aria-hidden="true" />,
    },
    {
      label: "Smartphones Charged",
      value: metrics.smartphonesCharged,
      icon: <FaMobileScreenButton aria-hidden="true" />,
    },
  ];

  return (
    <div className="impact-grid">
      {cards.map((card) => (
        <article className="impact-card" key={card.label}>
          <div className="impact-icon">{card.icon}</div>
          <h4>{card.value.toLocaleString()}</h4>
          <p>{card.label}</p>
        </article>
      ))}
    </div>
  );
}
