import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import "./TermsOfService.css";

const TermsOfService = () => {
  return (
    <>
      <Header />
      <main className="legal-page">
        <div className="container legal-page-content">
          <p className="legal-kicker">LEGAL</p>
          <h1>Terms of Service</h1>
          <p className="legal-updated">Last updated: March 27, 2026</p>

          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using CarbonAware, you agree to be bound by these
              Terms of Service and applicable laws.
            </p>
          </section>

          <section>
            <h2>2. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities under your account.
            </p>
          </section>

          <section>
            <h2>3. Platform Use</h2>
            <p>
              You agree not to misuse the platform, interfere with system
              operations, or attempt unauthorized access to data or services.
            </p>
          </section>

          <section>
            <h2>4. Content and Accuracy</h2>
            <p>
              Carbon footprint outputs are educational estimates based on the
              information you provide. They are not legal, financial, or
              regulatory advice.
            </p>
          </section>

          <section>
            <h2>5. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, CarbonAware is not liable
              for indirect, incidental, special, or consequential damages
              arising from your use of the platform.
            </p>
          </section>

          <section>
            <h2>6. Changes to Terms</h2>
            <p>
              We may revise these terms from time to time. Continued use of the
              platform after updates means you accept the revised terms.
            </p>
          </section>

          <section>
            <h2>7. Contact</h2>
            <p>
              For questions about these terms, contact us at
              dhadika45@gmail.com.
            </p>
          </section>

          <div className="legal-actions">
            <Link to="/" className="legal-home-btn">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TermsOfService;
