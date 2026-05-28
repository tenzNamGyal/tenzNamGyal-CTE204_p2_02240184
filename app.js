require('dotenv').config();
const express = require('express');
const cors = require('cors');
const subjectRoutes = require('./src/routes/subjects');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allows frontend to make fetch requests to this backend
app.use(express.json()); // Parses incoming JSON payloads

// Mount Routes
app.use('/api/subjects', subjectRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Academic Tracker API is running smoothly!' });
});

// 404 Route Catch-all
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Global Error Handler Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running live on http://localhost:${PORT}`);
});