import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Calculator.css";
import {
  MONTHS,
  calculateMonthlyCarbon,
  saveMonthlyTotal,
} from "../../utils/carbonMetrics";

const Calculator = () => {
  const [weeklyPlan, setWeeklyPlan] = useState([]);
  const [inputs, setInputs] = useState({
    electricity: "",
    gas: "",
    carMileage: "",
    flights: "",
    diet: "none",
  });
  const [month, setMonth] = useState("January");
  const [saveMessage, setSaveMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const calculation = useMemo(() => calculateMonthlyCarbon(inputs), [inputs]);
  const totalFootprint = calculation.totalKg;

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();

  const generatePlan = () => {
    const electricity = Number(inputs.electricity || 0);
    const gas = Number(inputs.gas || 0);
    const carMileage = Number(inputs.carMileage || 0);
    const flights = Number(inputs.flights || 0);
    const { breakdown } = calculation;

    if (totalFootprint <= 0) {
      setWeeklyPlan([
        "Enter your calculator values first so we can generate personalized reduction actions from your data.",
      ]);
      return;
    }

    const contributors = [
      {
        key: "electricity",
        label: "Electricity",
        value: Number(breakdown.electricity || 0),
      },
      { key: "gas", label: "Gas", value: Number(breakdown.gas || 0) },
      {
        key: "transport",
        label: "Transport",
        value: Number(breakdown.transport || 0),
      },
      { key: "diet", label: "Diet", value: Number(breakdown.diet || 0) },
    ].sort((a, b) => b.value - a.value);

    const biggest = contributors[0];
    const suggestions = [];

    if (biggest?.value > 0) {
      suggestions.push(
        `Your highest contributor is ${biggest.label} (${biggest.value.toFixed(1)} kg CO2/month). Start reducing this category first for the biggest impact.`,
      );
    }

    if (electricity > 0) {
      const reducedElectricity = Math.max(Math.round(electricity * 0.9), 0);
      suggestions.push(
        `Electricity: reduce from about ${electricity} kWh to ${reducedElectricity} kWh this month by switching off standby loads and using LEDs.`,
      );
    }

    if (gas > 0) {
      const reducedGas = Math.max(Math.round(gas * 0.9), 0);
      suggestions.push(
        `Gas: target around ${reducedGas} therms (from ${gas}) by lowering thermostat by 1 degree and sealing windows/doors.`,
      );
    }

    if (carMileage > 0) {
      const reducedMileage = Math.max(Math.round(carMileage * 0.85), 0);
      suggestions.push(
        `Car travel: reduce annual mileage from ${carMileage} to about ${reducedMileage} by replacing short trips with public transport/carpooling.`,
      );
    }

    if (flights > 0) {
      const reducedFlights = Math.max(flights - 1, 0);
      suggestions.push(
        `Flights: lower from ${flights} to ${reducedFlights} this month where possible, and prefer direct flights to cut emissions.`,
      );
    }

    if (inputs.diet === "average") {
      suggestions.push(
        "Diet: switch to at least 2-3 plant-based days per week to reduce diet emissions significantly.",
      );
    } else if (inputs.diet === "vegetarian") {
      suggestions.push(
        "Diet: keep your vegetarian pattern and prioritize seasonal/local foods to reduce food supply-chain emissions.",
      );
    } else if (inputs.diet === "vegan") {
      suggestions.push(
        "Diet: your food emissions are already low; focus next on electricity and transport for additional reductions.",
      );
    }

    const target = Math.max(Math.round(totalFootprint * 0.9), 1);
    suggestions.push(
      `Overall target: move from ${totalFootprint} to about ${target} kg CO2/month in ${month} (roughly 10% reduction).`,
    );

    const dataBackedFallbacks = [
      `Track weekly progress against ${target} kg and update your calculator values each week to stay on target.`,
      "Submit your monthly calculation after changes so your dashboard trend reflects your improvements.",
    ];

    const uniquePlan = [
      ...new Set([...suggestions, ...dataBackedFallbacks]),
    ].slice(0, 5);
    setWeeklyPlan(uniquePlan);
  };

  const handleSaveCalculation = () => {
    if (!totalFootprint || totalFootprint <= 0) {
      setSaveMessage("Enter values before saving to trend.");
      return;
    }

    saveMonthlyTotal({ totalKg: totalFootprint, monthName: month });
    setSaveMessage(`Saved ${month} total to monthly trend.`);
  };

  const handleSubmitCalc = async () => {
    setSubmitError("");
    setSaveMessage("");
    // don't submit if no meaningful value
    if (!totalFootprint || totalFootprint === 0) {
      setSubmitError("No calculated footprint to submit");
      return;
    }
    setSubmitting(true);
    try {
      const details = JSON.stringify({ ...inputs, month });
      await api.post("/calculations", { dataWasted: totalFootprint, details });
      // Keep trend chart in sync when users submit directly without clicking "Save Calculation".
      saveMonthlyTotal({ totalKg: totalFootprint, monthName: month });
      navigate("/dashboard");
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message ||
          err?.response?.data?.msg ||
          "Submit failed",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="calculator-page">
        <div className="container">
          <h1>Carbon Footprint Calculator</h1>

          <div className="calculator-form">
            {[
              { label: "Monthly Electricity Usage (kWh)", name: "electricity" },
              { label: "Monthly Gas Usage (therms)", name: "gas" },
              { label: "Annual Car Mileage", name: "carMileage" },
              { label: "Number of Flights (this month)", name: "flights" },
            ].map((field) => (
              <div className="form-group" key={field.name}>
                <label>{field.label}</label>
                <input
                  type="number"
                  name={field.name}
                  value={inputs[field.name]}
                  onChange={handleChange}
                />
              </div>
            ))}

            <div className="form-group">
              <label>Diet Type</label>
              <select name="diet" value={inputs.diet} onChange={handleChange}>
                <option value="none">Select Diet Type...</option>
                <option value="average">Average Meat Eater</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>

            <div className="form-group">
              <label>Month</label>
              <select
                name="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="result">
              <h3>Your Estimated Carbon Footprint:</h3>
              <p className="footprint-value">
                {totalFootprint ? `${totalFootprint} kg CO2/month` : "--"}
              </p>
              {inputs.diet !== "none" && (
                <p className="footprint-comparison">
                  The average carbon footprint for a person in the US is about
                  16,000 kg per year.
                </p>
              )}
              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  gap: 10,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={handleSaveCalculation}
                  className="btn"
                  type="button"
                >
                  Save Calculation
                </button>
                <button
                  onClick={handleSubmitCalc}
                  disabled={submitting}
                  className="btn"
                >
                  {submitting ? "Submitting..." : "Submit Monthly Calculation"}
                </button>
                {submitError && (
                  <div style={{ color: "crimson", marginTop: 8 }}>
                    {submitError}
                  </div>
                )}
                {!submitError && saveMessage && (
                  <div style={{ color: "#1b5e20", marginTop: 8 }}>
                    {saveMessage}
                  </div>
                )}
              </div>
            </div>
          </div>

          <section className="calculator-ai-plan">
            <div className="ai-plan-panel">
              <div className="ai-plan-icon" aria-hidden="true">
                AI
              </div>
              <div>
                <h3>Your personal AI reduction plan</h3>
                <p>
                  Click Try it now after entering your calculator values to get
                  5 data-based actions tailored to your footprint profile.
                </p>
              </div>
              <button
                type="button"
                className="ai-plan-btn ai-plan-action"
                onClick={generatePlan}
              >
                Try it now
              </button>
            </div>

            {weeklyPlan.length > 0 && (
              <article className="ai-plan-results">
                <div className="ai-plan-results-head">
                  <h4>Your 5-step weekly plan</h4>
                  <button
                    type="button"
                    className="ai-plan-regenerate"
                    onClick={generatePlan}
                  >
                    Regenerate
                  </button>
                </div>
                <ol>
                  {weeklyPlan.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </article>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Calculator;
