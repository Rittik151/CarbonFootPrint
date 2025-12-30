const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoute');
const calcRoutes = require('./routes/calculations');
const usersRoutes = require('./routes/users');
const connectDB = require('./config/db');


dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/calculations', calcRoutes);
app.use('/api/users', usersRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));