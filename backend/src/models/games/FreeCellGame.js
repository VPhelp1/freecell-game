const BaseGame = require('../BaseGame');
const { GAME_TYPES, GAME_CONFIG } = require('../../types/game-types');

/**
 * Класична гра FreeCell
 */
class FreeCellGame extends BaseGame {
  constructor() {
    super(GAME_TYPES.FREECELL, GAME_CONFIG[GAME_TYPES.FREECELL]);
    this.deal();
  }

  /**
   * Початкова гра
   */
  static startNew() {
    return new FreeCellGame();
  }
}

module.exports = FreeCellGame;