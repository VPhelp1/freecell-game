const GameFactory = require('../services/GameFactory');
const { GAME_TYPES } = require('../types/game-types');

describe('Basic Game Tests', () => {
  test('GameFactory creates FreeCell game', () => {
    const game = GameFactory.createGame(GAME_TYPES.FREECELL);
    expect(game).toBeDefined();
    expect(game.gameType).toBe(GAME_TYPES.FREECELL);
    expect(game.tableau).toHaveLength(8);
    expect(game.freeCells).toHaveLength(4);
  });

  test('GameFactory creates Baker\'s Game', () => {
    const game = GameFactory.createGame(GAME_TYPES.BAKERS_GAME);
    expect(game).toBeDefined();
    expect(game.gameType).toBe(GAME_TYPES.BAKERS_GAME);
    expect(game.config.moveRule).toBe('same_suit');
  });

  test('GameFactory creates Eight Off', () => {
    const game = GameFactory.createGame(GAME_TYPES.EIGHT_OFF);
    expect(game).toBeDefined();
    expect(game.gameType).toBe(GAME_TYPES.EIGHT_OFF);
    expect(game.freeCells).toHaveLength(8);
  });

  test('GameFactory creates Double FreeCell', () => {
    const game = GameFactory.createGame(GAME_TYPES.DOUBLE_FREECELL);
    expect(game).toBeDefined();
    expect(game.gameType).toBe(GAME_TYPES.DOUBLE_FREECELL);
    expect(game.tableau).toHaveLength(10);
    expect(game.freeCells).toHaveLength(8);
    expect(Object.keys(game.foundations)).toHaveLength(8);
  });

  test('Game serialization works', () => {
    const game = GameFactory.createGame(GAME_TYPES.FREECELL);
    const json = game.toJSON();
    
    expect(json).toHaveProperty('gameType');
    expect(json).toHaveProperty('tableau');
    expect(json).toHaveProperty('freeCells');
    expect(json).toHaveProperty('foundations');
    expect(json).toHaveProperty('gameWon');
  });
});

describe('Card Tests', () => {
  const Card = require('../models/Card');

  test('Card creation and properties', () => {
    const card = new Card('hearts', 'A', 0);
    expect(card.suit).toBe('hearts');
    expect(card.rank).toBe('A');
    expect(card.deckIndex).toBe(0);
    expect(card.getColor()).toBe('red');
    expect(card.getRankValue()).toBe(1);
  });

  test('Card serialization', () => {
    const card = new Card('spades', 'K', 1);
    const json = card.toJSON();
    
    expect(json.suit).toBe('spades');
    expect(json.rank).toBe('K');
    expect(json.deckIndex).toBe(1);
    expect(json.id).toBe('spades-K-1');
  });
});