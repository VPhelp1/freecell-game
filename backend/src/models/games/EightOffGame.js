const BaseGame = require('../BaseGame');
const { GAME_TYPES, GAME_CONFIG } = require('../../types/game-types');

/**
 * Eight Off - 8 вільних комірок замість 4
 */
class EightOffGame extends BaseGame {
  constructor() {
    super(GAME_TYPES.EIGHT_OFF, GAME_CONFIG[GAME_TYPES.EIGHT_OFF]);
    this.deal();
  }

  /**
   * Початкова гра
   */
  static startNew() {
    return new EightOffGame();
  }

  /**
   * В Eight Off більше вільних комірок (8 замість 4),
   * що робить гру легшою та дає більше стратегічних варіантів
   */
}

module.exports = EightOffGame;