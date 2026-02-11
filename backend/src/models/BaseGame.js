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
    // Якщо таблон порожній - карту можна покласти
    if (!destinationCard) return true;

    // Перевірка відповідно до правила
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
   * Отримати максимальну кількість карт які можна перемістити
   */
  getMaxMovableCards() {
    const emptyFreeCells = this.freeCells.filter(cell => cell === null).length;
    const emptyTableauPiles = this.tableau.filter(pile => pile.length === 0).length;

    // Формула: (emptyFreeCells + 1) * (2^emptyTableauPiles)
    return (emptyFreeCells + 1) * Math.pow(2, emptyTableauPiles);
  }

  /**
   * Перевірити чи послідовність карт валідна для переміщення
   */
  isValidSequence(cards, fromTableauIndex) {
    if (!cards || cards.length === 0) return false;
    if (cards.length > this.getMaxMovableCards()) return false;

    // Перевірка чи карти формують валідну послідовність
    for (let i = 0; i < cards.length - 1; i++) {
      const currentCard = cards[i];
      const nextCard = cards[i + 1];

      if (this.config.moveRule === MOVE_RULES.ALTERNATING_COLOR) {
        // Різний колір і на один менше
        if (currentCard.getColor() === nextCard.getColor()) return false;
        if (currentCard.getRankValue() !== nextCard.getRankValue() + 1) return false;
      } else if (this.config.moveRule === MOVE_RULES.SAME_SUIT) {
        // Та ж маст і на один менше
        if (currentCard.suit !== nextCard.suit) return false;
        if (currentCard.getRankValue() !== nextCard.getRankValue() + 1) return false;
      }
    }

    // Перевірка чи послідовність дійсно є в кінці таблону
    const pile = this.tableau[fromTableauIndex];
    const startIndex = pile.length - cards.length;

    for (let i = 0; i < cards.length; i++) {
      if (pile[startIndex + i].getId() !== cards[i].getId()) {
        return false;
      }
    }

    return true;
  }

  /**
   * Перемістити послідовність карт
   */
  moveSequence(fromTableauIndex, toTableauIndex, cardCount) {
    const fromPile = this.tableau[fromTableauIndex];
    const toPile = this.tableau[toTableauIndex];

    if (cardCount > fromPile.length) {
      return { success: false, error: 'Немає стільки карт' };
    }

    if (cardCount > this.getMaxMovableCards()) {
      return { success: false, error: 'Забагато карт для переміщення' };
    }

    const cardsToMove = fromPile.slice(fromPile.length - cardCount);

    // Перевірити чи послідовність валідна
    if (!this.isValidSequence(cardsToMove, fromTableauIndex)) {
      return { success: false, error: 'Послідовність карт не валідна' };
    }

    // Перевірити чи можна покласти на призначення
    if (toPile.length > 0) {
      const destinationCard = toPile[toPile.length - 1];
      const firstCard = cardsToMove[0];

      if (!this.isValidTableauMove(firstCard, destinationCard)) {
        return { success: false, error: 'Недозволений хід' };
      }
    }

    // Виконуємо переміщення
    const removedCards = fromPile.splice(fromPile.length - cardCount, cardCount);
    toPile.push(...removedCards);

    // Зберігаємо хід
    this.moveHistory.push({
      from: { type: 'tableau', index: fromTableauIndex },
      to: { type: 'tableau', index: toTableauIndex },
      cards: cardsToMove.map(card => card.toJSON()),
      type: 'sequence'
    });

    // Перевіряємо перемогу
    if (this.isGameWon()) {
      this.gameWon = true;
    }

    return {
      success: true,
      data: {
        cardsMoved: cardCount,
        from: fromTableauIndex,
        to: toTableauIndex,
        gameState: this.toJSON()
      }
    };
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
   * Відкат останнього ходу
   */
  undoMove() {
    if (this.moveHistory.length === 0) {
      return { success: false, error: 'Немає ходів для відкату' };
    }

    const lastMove = this.moveHistory.pop();

    // Відкат залежить від типу ходу
    if (lastMove.type === 'sequence') {
      // Для послідовності карт треба зрозуміти з якого таблону в який
      return this.undoSequenceMove(lastMove);
    }

    // Звичайний хід однієї карти
    const cardJSON = lastMove.card;
    const from = lastMove.from;
    const to = lastMove.to;

    // Переміщуємо карту назад
    const card = this.getCard({ type: to.type, index: to.index, key: to.key });
    if (!card) {
      return { success: false, error: 'Не вдалося знайти карту для відкату' };
    }

    this.removeCard({ type: to.type, index: to.index, key: to.key });
    this.addCard(from, card);

    return { success: true, data: this.toJSON() };
  }

  /**
   * Відкат послідовності карт
   */
  undoSequenceMove(move) {
    const fromIndex = move.from.index;
    const toIndex = move.to.index;
    const cards = move.cards.map(cardJSON => Card.fromJSON(cardJSON));

    // Переміщуємо карти назад
    const toPile = this.tableau[toIndex];
    const movedCards = toPile.splice(toPile.length - cards.length, cards.length);

    const fromPile = this.tableau[fromIndex];
    fromPile.push(...movedCards);

    return { success: true, data: this.toJSON() };
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
   * Перевірка програшу (немає можливих ходів)
   */
  isGameLost() {
    // Перевіряємо чи є можливі ходи з таблону
    for (let tableauIndex = 0; tableauIndex < this.tableau.length; tableauIndex++) {
      const pile = this.tableau[tableauIndex];
      if (pile.length === 0) continue;

      const card = pile[pile.length - 1];

      // Чи можна покласти на вільну комірку
      const emptyFreeCell = this.freeCells.findIndex(cell => cell === null);
      if (emptyFreeCell !== -1) return false; // Є хід

      // Чи можна покласти в фундамент
      for (const [foundationKey, foundationPile] of Object.entries(this.foundations)) {
        if (this.isValidFoundationMove(card, foundationPile)) {
          return false; // Є хід
        }
      }

      // Чи можна покласти на інший таблон
      for (let i = 0; i < this.tableau.length; i++) {
        if (i === tableauIndex) continue; // Той самий таблон

        const destPile = this.tableau[i];
        if (destPile.length === 0) {
          // На порожній таблон - перевіряємо макс. карт
          const maxCards = this.getMaxMovableCards();
          if (pile.length <= maxCards) return false; // Є хід
        } else {
          const destCard = destPile[destPile.length - 1];
          if (this.isValidTableauMove(card, destCard)) {
            return false; // Є хід
          }
        }
      }

      // Чи можна перемістити послідовність карт
      const maxMovable = this.getMaxMovableCards();
      if (pile.length > 1 && pile.length <= maxMovable) {
        const sequence = pile.slice(pile.length - maxMovable);
        if (this.isValidSequence(sequence, tableauIndex)) {
          return false; // Є хід
        }
      }
    }

    // Перевіряємо чи є можливі ходи з вільних комірок
    for (let freeCellIndex = 0; freeCellIndex < this.freeCells.length; freeCellIndex++) {
      const card = this.freeCells[freeCellIndex];
      if (!card) continue;

      // Чи можна покласти на таблон
      for (let i = 0; i < this.tableau.length; i++) {
        const destPile = this.tableau[i];
        if (destPile.length === 0) return false; // На порожній таблон завжди можна

        const destCard = destPile[destPile.length - 1];
        if (this.isValidTableauMove(card, destCard)) {
          return false; // Є хід
        }
      }

      // Чи можна покласти в фундамент
      for (const [foundationKey, foundationPile] of Object.entries(this.foundations)) {
        if (this.isValidFoundationMove(card, foundationPile)) {
          return false; // Є хід
        }
      }
    }

    // Якщо дійшли сюди - немає можливих ходів
    this.gameLost = true;
    return true;
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