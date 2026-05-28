require('dotenv').config();
const express = require('express');
const cors = require('cors');
const subjectRoutes = require('./src/routes/subjects');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static elements directly out of public directory
app.use(express.static('public'));

app.use(cors());
app.use(express.json());

// API Layer Route Registration
app.use('/api/subjects', subjectRoutes);

// Fallback Route for non-matching assets
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Resource path not found' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 System server handling operations live on http://localhost:${PORT}`);
});