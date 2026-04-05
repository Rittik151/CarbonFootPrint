import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <>
      <Header />
      <main className="legal-page">
        <div className="container legal-page-content">
          <p className="legal-kicker">LEGAL</p>
          <h1>Privacy Policy</h1>
          <p className="legal-updated">Last updated: March 27, 2026</p>

          <section>
            <h2>1. Information We Collect</h2>
            <p>
              We collect information you provide directly, such as your account
              details, calculator inputs, and support messages. We also collect
              basic usage and device information to keep the service secure and
              improve performance.
            </p>
          </section>

          <section>
            <h2>2. How We Use Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Create and manage your account</li>
              <li>Provide personalized carbon calculations and insights</li>
              <li>Improve product features and reliability</li>
              <li>Send important service updates and account notices</li>
            </ul>
          </section>

          <section>
            <h2>3. Sharing of Information</h2>
            <p>
              We do not sell personal information. We may share data with
              trusted service providers who help us operate the platform,
              subject to confidentiality and security obligations.
            </p>
          </section>

          <section>
            <h2>4. Data Security</h2>
            <p>
              We use reasonable technical and organizational safeguards to
              protect data against unauthorized access, alteration, disclosure,
              or destruction.
            </p>
          </section>

          <section>
            <h2>5. Your Choices</h2>
            <p>
              You can update your profile information and request account
              deletion by contacting support. You may also opt out of non-
              essential email communications.
            </p>
          </section>

          <section>
            <h2>6. Contact</h2>
            <p>
              If you have privacy-related questions, contact us at
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

export default PrivacyPolicy;
