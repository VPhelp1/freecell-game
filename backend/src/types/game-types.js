/**
 * Типи та константи для різних варіантів FreeCell
 */

const GAME_TYPES = {
  FREECELL: 'freecell',
  BAKERS_GAME: 'bakers_game', 
  EIGHT_OFF: 'eight_off',
  DOUBLE_FREECELL: 'double_freecell'
};

const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const GAME_CONFIG = {
  [GAME_TYPES.FREECELL]: {
    name: 'Classic FreeCell',
    freeCells: 4,
    tableauPiles: 8,
    foundationPiles: 4,
    decks: 1,
    moveRule: 'alternating_color'
  },
  [GAME_TYPES.BAKERS_GAME]: {
    name: "Baker's Game",
    freeCells: 4,
    tableauPiles: 8,
    foundationPiles: 4,
    decks: 1,
    moveRule: 'same_suit'
  },
  [GAME_TYPES.EIGHT_OFF]: {
    name: 'Eight Off',
    freeCells: 8,
    tableauPiles: 8,
    foundationPiles: 4,
    decks: 1,
    moveRule: 'alternating_color'
  },
  [GAME_TYPES.DOUBLE_FREECELL]: {
    name: 'Double FreeCell',
    freeCells: 8,
    tableauPiles: 10,
    foundationPiles: 8,
    decks: 2,
    moveRule: 'alternating_color'
  }
};

const MOVE_RULES = {
  ALTERNATING_COLOR: 'alternating_color',
  SAME_SUIT: 'same_suit'
};

module.exports = {
  GAME_TYPES,
  SUITS,
  RANKS,
  GAME_CONFIG,
  MOVE_RULES
};