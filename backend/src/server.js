const express = require('express');
const cors = require('cors');
const path = require('path');
const gameRoutes = require('./routes/gameRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Статичні файли (публічна сторінка)
app.use(express.static(path.join(__dirname, '../../public')));

// Статичні файли (для тестера)
app.use('/tester', express.static(path.join(__dirname, '../../')));

// Маршрути
app.use('/api/games', gameRoutes);

// Базовий маршрут
app.get('/', (req, res) => {
  res.json({
    message: 'FreeCell Variants Backend API',
    version: '1.0.0',
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

// Обробка помилок
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Внутрішня помилка сервера'
  });
});

// 404 обробник
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Маршрут не знайдено'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API endpoints available at http://localhost:${PORT}`);
  console.log(`🎮 Game types: http://localhost:${PORT}/api/games/types`);
});

module.exports = app;