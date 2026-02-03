const FreeCellGame = require('../models/games/FreeCellGame');
const BakersGame = require('../models/games/BakersGame');
const EightOffGame = require('../models/games/EightOffGame');
const DoubleFreeCell = require('../models/games/DoubleFreeCell');
const { GAME_TYPES } = require('../types/game-types');

/**
 * Фабрика для створення різних типів ігор
 */
class GameFactory {
  /**
   * Створити нову гру вказаного типу
   * @param {string} gameType - тип гри
   * @returns {BaseGame} - екземпляр гри
   */
  static createGame(gameType) {
    switch (gameType) {
      case GAME_TYPES.FREECELL:
        return FreeCellGame.startNew();
      
      case GAME_TYPES.BAKERS_GAME:
        return BakersGame.startNew();
      
      case GAME_TYPES.EIGHT_OFF:
        return EightOffGame.startNew();
      
      case GAME_TYPES.DOUBLE_FREECELL:
        return DoubleFreeCell.startNew();
      
      default:
        throw new Error(`Невідомий тип гри: ${gameType}`);
    }
  }

  /**
   * Отримати список доступних типів ігор
   * @returns {Array} - масив об'єктів з інформацією про типи ігор
   */
  static getAvailableGameTypes() {
    return Object.values(GAME_TYPES).map(gameType => {
      const config = require('../types/game-types').GAME_CONFIG[gameType];
      return {
        type: gameType,
        name: config.name,
        description: this.getGameDescription(gameType),
        features: {
          freeCells: config.freeCells,
          tableauPiles: config.tableauPiles,
          foundationPiles: config.foundationPiles,
          decks: config.decks,
          moveRule: config.moveRule
        }
      };
    });
  }

  /**
   * Отримати опис гри
   * @param {string} gameType 
   * @returns {string}
   */
  static getGameDescription(gameType) {
    const descriptions = {
      [GAME_TYPES.FREECELL]: 'Класичний FreeCell - перемістіть всі карти в фундаменти, будуючи в масті від туза до короля',
      [GAME_TYPES.BAKERS_GAME]: 'Baker\'s Game - як FreeCell, але карти в таблоні можна класти тільки в тій же масті',
      [GAME_TYPES.EIGHT_OFF]: 'Eight Off - як FreeCell, але з 8 вільними комірками замість 4',
      [GAME_TYPES.DOUBLE_FREECELL]: 'Double FreeCell - подвійна колода з 104 картами, 8 вільних комірок та 8 фундаментів'
    };
    
    return descriptions[gameType] || 'Опис недоступний';
  }
}

module.exports = GameFactory;