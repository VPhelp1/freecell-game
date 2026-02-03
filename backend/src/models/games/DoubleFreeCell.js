const BaseGame = require('../BaseGame');
const { GAME_TYPES, GAME_CONFIG } = require('../../types/game-types');

/**
 * Double FreeCell - подвійна колода (104 карти)
 */
class DoubleFreeCell extends BaseGame {
  constructor() {
    super(GAME_TYPES.DOUBLE_FREECELL, GAME_CONFIG[GAME_TYPES.DOUBLE_FREECELL]);
    this.deal();
  }

  /**
   * Початкова гра
   */
  static startNew() {
    return new DoubleFreeCell();
  }

  /**
   * Перевірка валідності ходу в фундамент для подвійної колоди
   * В подвійному FreeCell можна класти карти одної масті в два різні фундаменти
   */
  isValidFoundationMove(card, foundationPile) {
    if (foundationPile.length === 0) {
      return card.getRankValue() === 1; // Тільки тузи
    }
    
    const topCard = foundationPile[foundationPile.length - 1];
    return card.suit === topCard.suit && 
           card.getRankValue() === topCard.getRankValue() + 1;
  }

  /**
   * Отримати доступні фундаменти для карти
   */
  getAvailableFoundations(card) {
    const availableFoundations = [];
    
    Object.entries(this.foundations).forEach(([key, pile]) => {
      if (key.startsWith(card.suit) && this.isValidFoundationMove(card, pile)) {
        availableFoundations.push(key);
      }
    });
    
    return availableFoundations;
  }
}

module.exports = DoubleFreeCell;