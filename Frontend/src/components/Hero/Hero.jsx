import { Link } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="home-hero">
      <div className="container">
        <span className="hero-badge">AI-POWERED SUSTAINABILITY</span>
        <h1>Turn Climate Awareness Into Measurable Action</h1>
        <p>
          AI-powered carbon footprint analysis, verified offset projects, and
          step-by-step reduction plans. Sustainability made simple, personal,
          and impactful.
        </p>
        <div className="hero-cta-row">
          <Link to="/calculator" className="home-btn home-btn-primary">
            Calculate My Footprint
          </Link>
          <Link to="/resources" className="home-btn home-btn-secondary">
            Explore Resources
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
