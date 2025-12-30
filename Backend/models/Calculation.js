const mongoose = require('mongoose');

const CalculationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dataWasted: { type: Number, required: true },
    details: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Calculation', CalculationSchema);
