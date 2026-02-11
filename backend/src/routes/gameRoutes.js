const express = require('express');
const GameController = require('../controllers/GameController');

const router = express.Router();
const gameController = new GameController();

// Маршрути для API
router.get('/types', gameController.getGameTypes.bind(gameController));
router.post('/create', gameController.createGame.bind(gameController));
router.get('/:gameId', gameController.getGameState.bind(gameController));
router.post('/:gameId/move', gameController.makeMove.bind(gameController));
router.post('/:gameId/sequence', gameController.moveSequence.bind(gameController));
router.post('/:gameId/undo', gameController.undoMove.bind(gameController));
router.post('/:gameId/reset', gameController.resetGame.bind(gameController));
router.delete('/:gameId', gameController.deleteGame.bind(gameController));
router.get('/stats/overview', gameController.getStats.bind(gameController));

module.exports = router;