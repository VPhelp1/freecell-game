const express = require('express');
const cors = require('cors');
const path = require('path');
const gameRoutes = require('./backend/src/routes/gameRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend (public folder)
app.use(express.static(path.join(__dirname, 'public')));

// Serve standalone game as fallback
app.get('/play', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/standalone', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve docs for GitHub Pages compatibility
app.use('/docs', express.static(path.join(__dirname, 'docs')));

// Маршрути
app.use('/api/games', gameRoutes);

// Базовий маршрут
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Health check for Vercel
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', version: '1.0.0' });
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
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Local development
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📱 Frontend: http://localhost:${PORT}`);
        console.log(`🎮 Game: http://localhost:${PORT}/play`);
        console.log(`🔌 API: http://localhost:${PORT}/api/games/types`);
    });
}

module.exports = app;
