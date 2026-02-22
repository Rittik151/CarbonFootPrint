import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import Header from '../components/Header';
import Footer from '../components/Footer';

const EMISSION_FACTORS = {
  ELECTRICITY: 0.92,
  GAS: 2.2,
  CAR: 2.4,
  FLIGHTS: 90,
  DIET: {
    vegan: 800,
    vegetarian: 1000,
    average: 1200,
    none: 0, // Emission factor for 'none'
  },
};

const Calculator = () => {
  const [inputs, setInputs] = useState({
    electricity: "",
    gas: "",
    carMileage: "",
    flights: "",
    diet: 'none' // Set default to 'none'
  });
  const [month, setMonth] = useState('January');

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const { electricity, gas, carMileage, flights, diet } = inputs;

  const totalFootprint = useMemo(() => {
    // Compute annual total then monthly total
    // If diet is 'none' and other values zero, return 0
    const annualDiet = EMISSION_FACTORS.DIET[diet] || 0;

    const annualTotal =
      (Number(electricity) * EMISSION_FACTORS.ELECTRICITY * 12) + // electricity input is monthly, convert to annual
      (Number(gas) * EMISSION_FACTORS.GAS * 12) + // gas monthly -> annual
      (Number(carMileage) * EMISSION_FACTORS.CAR) + // carMileage assumed annual
      (Number(flights) * EMISSION_FACTORS.FLIGHTS) + // flights per year
      annualDiet;

    const monthlyTotal = annualTotal / 12;
    return Math.round(monthlyTotal);
  }, [electricity, gas, carMileage, flights, diet]);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  const handleSubmitCalc = async () => {
    setSubmitError('');
    // don't submit if no meaningful value
    if (!totalFootprint || totalFootprint === 0) {
      setSubmitError('No calculated footprint to submit');
      return;
    }
    setSubmitting(true);
    try {
      const details = JSON.stringify({ ...inputs, month });
      await api.post('/calculations', { dataWasted: totalFootprint, details });
      navigate('/dashboard');
    } catch (err) {
      setSubmitError(err?.response?.data?.message || err?.response?.data?.msg || 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="calculator-page" style={{backgroundColor:"#4e9289ff"}}>
        <div className="container">
          <h1>Carbon Footprint Calculator</h1>
          
          <div className="calculator-form" style={{backgroundColor:"#8dbcc1"}}>
            {[
              { label: 'Monthly Electricity Usage (kWh)', name: 'electricity' },
              { label: 'Monthly Gas Usage (therms)', name: 'gas' },
              { label: 'Annual Car Mileage', name: 'carMileage' },
              { label: 'Number of Flights (this month)', name: 'flights' },
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
              <select name="month" value={month} onChange={(e) => setMonth(e.target.value)}>
                {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            
            <div className="result">
              <h3>Your Estimated Carbon Footprint:</h3>
              <p className="footprint-value">
                {totalFootprint ? `${totalFootprint} kg CO2/month` : '--'}
              </p>
              {inputs.diet !== 'none' && (
                <p className="footprint-comparison">
                  The average carbon footprint for a person in the US is about 16,000 kg per year.
                </p>
              )}
              <div style={{ marginTop: 12 }}>
                <button onClick={handleSubmitCalc} disabled={submitting} className="btn">
                  {submitting ? 'Submitting...' : 'Submit Monthly Calculation'}
                </button>
                {submitError && <div style={{ color: 'crimson', marginTop: 8 }}>{submitError}</div>}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Calculator;