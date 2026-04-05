import { Link, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import './FeaturePreview.css';

const featureMap = {
  "community-leaderboard": {
    title: "Community Leaderboard",
    summary:
      "Compare your sustainability streaks with the community and stay motivated with weekly rankings.",
    points: [
      "Anonymous ranking based on consistency",
      "Weekly sustainability challenge boards",
      "Achievement badges for milestone progress",
    ],
  },
  "monthly-reports": {
    title: "Monthly Reports",
    summary:
      "Receive a detailed monthly PDF summary with trends, category insights, and practical reduction recommendations.",
    points: [
      "Month-over-month footprint comparison",
      "AI-generated improvement highlights",
      "Shareable report for team or family goals",
    ],
  },
  "offset-marketplace": {
    title: "Offset Marketplace",
    summary:
      "Browse curated climate projects and directly fund verified initiatives that match your footprint profile.",
    points: [
      "Verified reforestation, solar, and clean-water projects",
      "Transparent impact tracking per project",
      "Filter projects by budget and impact type",
    ],
  },
  "green-certifications": {
    title: "Green Certifications",
    summary:
      "Unlock shareable certifications as you meet your reduction goals and complete climate-positive actions.",
    points: [
      "Level-based certifications",
      "Public profile showcase for achievements",
      "Progress-linked verification checks",
    ],
  },
};

const FeaturePreview = () => {
  const { featureKey } = useParams();
  const feature = featureMap[featureKey];

  return (
    <>
      <Header />
      <main className="feature-page">
        <div className="container feature-card">
          {feature ? (
            <>
              <p className="feature-kicker">UPCOMING FEATURE</p>
              <h1>{feature.title}</h1>
              <p className="feature-summary">{feature.summary}</p>

              <ul className="feature-points">
                {feature.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>

              <div className="feature-actions">
                <Link to="/dashboard" className="btn">
                  Go to Dashboard
                </Link>
                <Link to="/" className="feature-link-back">
                  Back to Home
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1>Feature Not Found</h1>
              <p className="feature-summary">
                This feature link is unavailable right now. Please return to the
                home page and choose another option.
              </p>
              <Link to="/" className="feature-link-back">
                Back to Home
              </Link>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default FeaturePreview;
