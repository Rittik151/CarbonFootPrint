import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Hero from "../../components/Hero/Hero";
import "./Home.css";

const Home = () => {
  const offerCards = [
    {
      title: "Carbon Calculator",
      body: "Get precise footprint analysis across transport, energy, diet, and shopping with our AI-powered tool.",
      link: "/calculator",
      cta: "Calculate now ->",
      icon: "CC",
    },
    {
      title: "Educational Resources",
      body: "Learn how to reduce your impact with expert guides, articles, and actionable tips for every lifestyle.",
      link: "/resources",
      cta: "Explore resources ->",
      icon: "ER",
    },
    {
      title: "Track Progress",
      body: "Monitor your carbon journey over time, see streaks, earn eco-badges, and celebrate real milestones.",
      link: "/dashboard",
      cta: "Go to dashboard ->",
      icon: "TP",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Calculate",
      desc: "Answer a few questions about your lifestyle - travel, home, food, and spending.",
    },
    {
      number: "02",
      title: "Understand",
      desc: "Get a clear breakdown of where your emissions come from with visual reports.",
    },
    {
      number: "03",
      title: "Act",
      desc: "Follow your personalized AI reduction plan and track weekly progress.",
    },
    {
      number: "04",
      title: "Offset",
      desc: "Browse verified reforestation, solar, and clean water projects to offset what remains.",
    },
  ];

  return (
    <>
      <Header />
      <main className="home-page">
        <Hero />

        <section className="home-section offer-section">
          <div className="container">
            <p className="section-kicker">WHAT WE OFFER</p>
            <h2>Everything you need to go green</h2>
            <p className="section-lead">
              From measuring your impact to offsetting it - all in one place.
            </p>
            <div className="offer-grid">
              {offerCards.map((card) => (
                <article key={card.title} className="offer-card">
                  <span className="offer-icon" aria-hidden="true">
                    {card.icon}
                  </span>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                  <Link to={card.link}>{card.cta}</Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="home-section steps-section">
          <div className="container">
            <p className="section-kicker">HOW IT WORKS</p>
            <h2>Four steps to a smaller footprint</h2>
            <div className="steps-grid">
              {steps.map((step) => (
                <article key={step.number} className="step-card">
                  <span>{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
