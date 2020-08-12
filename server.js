const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const dbConnect = require('./config/dbConnect');

// Initialize express app
const app = express();

// Setup logging in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Load config
dotenv.config({ path: './config/.env' });

// Connect to the MongoDB database
dbConnect();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(cors());

// Serve static files from public
app.use(express.static(path.join('public')));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Dungeon Brain API.');
});
app.use('/api/characters', require('./routes/api/characters'));
app.use('/api/users', require('./routes/api/users'));

// Set port
const PORT = process.env.PORT || 3000;

// Run server
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
