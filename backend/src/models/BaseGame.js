const Card = require('./Card');
const { SUITS, RANKS, MOVE_RULES } = require('../types/game-types');

/**
 * Базовий клас для всіх варіантів FreeCell
 */
class BaseGame {
  constructor(gameType, config) {
    this.gameType = gameType;
    this.config = config;
    this.reset();
  }

  /**
   * Скидання гри до початкового стану
   */
  reset() {
    this.tableau = Array(this.config.tableauPiles).fill(null).map(() => []);
    this.freeCells = Array(this.config.freeCells).fill(null);
    this.foundations = this.initializeFoundations();
    this.moveHistory = [];
    this.gameWon = false;
    this.gameLost = false;
  }

  /**
   * Ініціалізація фундаментів (залежить від кількості колод)
   */
  initializeFoundations() {
    const foundations = {};
    for (let i = 0; i < this.config.decks; i++) {
      SUITS.forEach(suit => {
        const key = this.config.decks === 1 ? suit : `${suit}_${i}`;
        foundations[key] = [];
      });
    }
    return foundations;
  }

  /**
   * Роздача карт
   */
  deal() {
    const deck = this.createDeck();
    this.shuffleDeck(deck);

    let cardIndex = 0;
    while (cardIndex < deck.length) {
      this.tableau[cardIndex % this.config.tableauPiles].push(deck[cardIndex]);
      cardIndex++;
    }
  }

  /**
   * Створення колоди карт
   */
  createDeck() {
    const deck = [];
    for (let deckIndex = 0; deckIndex < this.config.decks; deckIndex++) {
      SUITS.forEach(suit => {
        RANKS.forEach(rank => {
          deck.push(new Card(suit, rank, deckIndex));
        });
      });
    }
    return deck;
  }

  /**
   * Перемішування колоди
   */
  shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  /**
   * Перевірка валідності ходу в таблоні
   */
  isValidTableauMove(card, destinationCard) {
    if (this.config.moveRule === MOVE_RULES.ALTERNATING_COLOR) {
      return card.getColor() !== destinationCard.getColor() && 
             card.getRankValue() === destinationCard.getRankValue() - 1;
    } else if (this.config.moveRule === MOVE_RULES.SAME_SUIT) {
      return card.suit === destinationCard.suit && 
             card.getRankValue() === destinationCard.getRankValue() - 1;
    }
    return false;
  }

  /**
   * Перевірка валідності ходу в фундамент
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
   * Отримання карти з позиції
   */
  getCard(location) {
    if (!location) return null;

    switch (location.type) {
      case 'tableau':
        const pile = this.tableau[location.index];
        return pile.length > 0 ? pile[pile.length - 1] : null;
      case 'freeCell':
        return this.freeCells[location.index];
      case 'foundation':
        const foundPile = this.foundations[location.key];
        return foundPile && foundPile.length > 0 ? foundPile[foundPile.length - 1] : null;
      default:
        return null;
    }
  }

  /**
   * Видалення карти з позиції
   */
  removeCard(location) {
    switch (location.type) {
      case 'tableau':
        return this.tableau[location.index].pop();
      case 'freeCell':
        const card = this.freeCells[location.index];
        this.freeCells[location.index] = null;
        return card;
      case 'foundation':
        return this.foundations[location.key].pop();
      default:
        return null;
    }
  }

  /**
   * Додавання карти до позиції
   */
  addCard(location, card) {
    switch (location.type) {
      case 'tableau':
        this.tableau[location.index].push(card);
        break;
      case 'freeCell':
        this.freeCells[location.index] = card;
        break;
      case 'foundation':
        this.foundations[location.key].push(card);
        break;
    }
  }

  /**
   * Виконання ходу
   */
  makeMove(from, to) {
    const card = this.getCard(from);
    if (!card) return { success: false, error: 'Немає карти для переміщення' };

    if (!this.isValidMove(card, from, to)) {
      return { success: false, error: 'Недозволений хід' };
    }

    // Зберігаємо хід для відкату
    const moveData = {
      from: { ...from },
      to: { ...to },
      card: { ...card.toJSON() }
    };

    // Виконуємо хід
    this.removeCard(from);
    this.addCard(to, card);
    
    this.moveHistory.push(moveData);

    // Перевіряємо перемогу
    if (this.isGameWon()) {
      this.gameWon = true;
    }

    return { success: true, move: moveData };
  }

  /**
   * Перевірка валідності ходу
   */
  isValidMove(card, from, to) {
    switch (to.type) {
      case 'tableau':
        const destPile = this.tableau[to.index];
        if (destPile.length === 0) return true; // Можна класти на пусту стовпчик
        return this.isValidTableauMove(card, destPile[destPile.length - 1]);
      
      case 'freeCell':
        return this.freeCells[to.index] === null; // Вільна комірка повинна бути пуста
      
      case 'foundation':
        return this.isValidFoundationMove(card, this.foundations[to.key]);
      
      default:
        return false;
    }
  }

  /**
   * Перевірка перемоги
   */
  isGameWon() {
    const totalCards = Object.values(this.foundations)
      .reduce((sum, pile) => sum + pile.length, 0);
    return totalCards === (52 * this.config.decks);
  }

  /**
   * Серіалізація стану гри
   */
  toJSON() {
    return {
      gameType: this.gameType,
      config: this.config,
      tableau: this.tableau.map(pile => pile.map(card => card.toJSON())),
      freeCells: this.freeCells.map(card => card ? card.toJSON() : null),
      foundations: Object.fromEntries(
        Object.entries(this.foundations).map(([key, pile]) => 
          [key, pile.map(card => card.toJSON())]
        )
      ),
      gameWon: this.gameWon,
      gameLost: this.gameLost,
      moveCount: this.moveHistory.length
    };
  }
}

module.exports = BaseGame;