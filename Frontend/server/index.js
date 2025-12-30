import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Define some example emission factors (in kg CO2e per unit)
// In a real app, these would be more accurate and sourced from reliable data.
const EMISSION_FACTORS = {
  electricity: 0.93, // kg CO2e per kWh
  vehicle: 0.21,     // kg CO2e per km
};

app.use(cors());
app.use(express.json());

// Update the /api/calculate endpoint
app.post('/api/calculate', (req, res) => {
  try {
    // Get the user's input from the request body
    const { electricity, distance } = req.body;

    // Convert inputs to numbers, defaulting to 0 if they are not provided
    const electricityKWh = Number(electricity) || 0;
    const distanceKm = Number(distance) || 0;

    // Perform the calculation
    const electricityEmissions = electricityKWh * EMISSION_FACTORS.electricity;
    const vehicleEmissions = distanceKm * EMISSION_FACTORS.vehicle;
    const totalEmissions = electricityEmissions + vehicleEmissions;

    console.log(`Calculation: ${totalEmissions.toFixed(2)} kg CO2e`);

    // Send the calculated result back to the front-end
    res.status(200).json({ success: true, footprint: totalEmissions });
  } catch (error) {
    console.error('Calculation error:', error);
    res.status(500).json({ success: false, message: 'Error performing calculation.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});