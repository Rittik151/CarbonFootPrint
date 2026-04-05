import { Link } from "react-router-dom";
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer simple-footer">
      <div className="container simple-footer-layout">
        <div className="simple-footer-brand">
          <h3>CarbonAware</h3>
          <p>Making sustainability simple since 2024.</p>
        </div>

        <nav className="simple-footer-links" aria-label="Footer links">
          <Link to="/">Home</Link>
          <Link to="/calculator">Carbon Calculator</Link>
          <Link to="/resources">Educational Resources</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
        </nav>

        <p className="simple-footer-copy">
          © 2025 CarbonAware. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
