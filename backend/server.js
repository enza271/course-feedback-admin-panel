require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Course Feedback API is running successfully.'
  });
});

app.use('/api/feedback', feedbackRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((field) => field.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid identifier provided.' });
  }

  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: 'Duplicate entry found.' });
  }

  return res.status(500).json({ success: false, message: 'Internal server error.' });
});

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in environment variables. Please create backend/.env before starting the server.');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });
