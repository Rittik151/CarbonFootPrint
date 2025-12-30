import { Link } from 'react-router-dom';

const Features = () => {
  return (
    <section className="features"  style={{backgroundColor:"#4e9289ff"}}>
      <div className="container">
        <div className="feature-card">
          <h2>Carbon Calculator</h2>
          <p>Get precise footprint analysis with our AI-powered calculation tool.</p>
          <Link to="/calculator" className="btn">Calculate Now</Link>
        </div>
        
        <div className="feature-card">
          <h2>Educational Resources</h2>
          <p>Learn how to reduce your impact with our expert guides.</p>
          <Link to="/resources" className="btn">Explore Resources</Link>
        </div>
      </div>
    </section>
  );
};

export default Features;