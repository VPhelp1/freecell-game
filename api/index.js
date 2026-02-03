// Vercel serverless function entry point
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import all the game logic
const gameRoutes = require('../backend/src/routes/gameRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/games', gameRoutes);

// Root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'FreeCell Variants Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      gameTypes: '/api/games/types',
      createGame: 'POST /api/games/create',
      gameState: '/api/games/:gameId',
      makeMove: 'POST /api/games/:gameId/move',
      resetGame: 'POST /api/games/:gameId/reset',
      deleteGame: 'DELETE /api/games/:gameId',
      stats: '/api/games/stats/overview'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Внутрішня помилка сервера'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint не знайдено'
  });
});

module.exports = app;