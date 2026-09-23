const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoute');
const calcRoutes = require('./routes/calculations');
const usersRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const connectDB = require('./config/db');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/calculations', calcRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/admin', adminRoutes);


connectDB()
	.then(() => {
		app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
	})
	.catch(() => {
		process.exit(1);
	});