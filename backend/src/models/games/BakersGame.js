const BaseGame = require('../BaseGame');
const { GAME_TYPES, GAME_CONFIG } = require('../../types/game-types');

/**
 * Baker's Game - рухи тільки в тій же масті
 */
class BakersGame extends BaseGame {
  constructor() {
    super(GAME_TYPES.BAKERS_GAME, GAME_CONFIG[GAME_TYPES.BAKERS_GAME]);
    this.deal();
  }

  /**
   * Початкова гра
   */
  static startNew() {
    return new BakersGame();
  }

  /**
   * Додаткові правила для Baker's Game
   * В Baker's Game карти в таблоні можна класти тільки в масті,
   * а не за кольором як в звичайному FreeCell
   */
}

module.exports = BakersGame;