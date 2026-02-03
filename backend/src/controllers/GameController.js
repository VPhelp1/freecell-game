const GameFactory = require('../services/GameFactory');
const { v4: uuidv4 } = require('uuid');

/**
 * Контролер для управління іграми
 */
class GameController {
  constructor() {
    this.games = new Map(); // Зберігаємо активні ігри в пам'яті
  }

  /**
   * Отримати список доступних типів ігор
   */
  getGameTypes(req, res) {
    try {
      const gameTypes = GameFactory.getAvailableGameTypes();
      res.json({
        success: true,
        data: gameTypes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Створити нову гру
   */
  createGame(req, res) {
    try {
      const { gameType } = req.body;
      
      if (!gameType) {
        return res.status(400).json({
          success: false,
          error: 'Тип гри не вказано'
        });
      }

      const game = GameFactory.createGame(gameType);
      const gameId = uuidv4();
      
      this.games.set(gameId, game);

      res.json({
        success: true,
        data: {
          gameId,
          gameState: game.toJSON()
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Отримати стан гри
   */
  getGameState(req, res) {
    try {
      const { gameId } = req.params;
      const game = this.games.get(gameId);

      if (!game) {
        return res.status(404).json({
          success: false,
          error: 'Гру не знайдено'
        });
      }

      res.json({
        success: true,
        data: game.toJSON()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Зробити хід
   */
  makeMove(req, res) {
    try {
      const { gameId } = req.params;
      const { from, to } = req.body;
      
      const game = this.games.get(gameId);
      
      if (!game) {
        return res.status(404).json({
          success: false,
          error: 'Гру не знайдено'
        });
      }

      if (!from || !to) {
        return res.status(400).json({
          success: false,
          error: 'Не вказано позиції ходу'
        });
      }

      const result = game.makeMove(from, to);

      if (result.success) {
        res.json({
          success: true,
          data: {
            move: result.move,
            gameState: game.toJSON()
          }
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.error
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Скинути гру
   */
  resetGame(req, res) {
    try {
      const { gameId } = req.params;
      const game = this.games.get(gameId);

      if (!game) {
        return res.status(404).json({
          success: false,
          error: 'Гру не знайдено'
        });
      }

      game.reset();
      game.deal();

      res.json({
        success: true,
        data: game.toJSON()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Видалити гру
   */
  deleteGame(req, res) {
    try {
      const { gameId } = req.params;
      
      if (this.games.has(gameId)) {
        this.games.delete(gameId);
        res.json({
          success: true,
          message: 'Гру видалено'
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Гру не знайдено'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Отримати статистику активних ігор
   */
  getStats(req, res) {
    try {
      const gamesByType = {};
      
      this.games.forEach(game => {
        if (!gamesByType[game.gameType]) {
          gamesByType[game.gameType] = 0;
        }
        gamesByType[game.gameType]++;
      });

      res.json({
        success: true,
        data: {
          totalGames: this.games.size,
          gamesByType
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = GameController;