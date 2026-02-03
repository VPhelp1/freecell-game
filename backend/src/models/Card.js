/**
 * Модель карти
 */
class Card {
  constructor(suit, rank, deckIndex = 0) {
    this.suit = suit;
    this.rank = rank;
    this.deckIndex = deckIndex; // Для подвійної колоди
  }

  /**
   * Отримати колір карти
   * @returns {string} 'red' або 'black'
   */
  getColor() {
    return ['hearts', 'diamonds'].includes(this.suit) ? 'red' : 'black';
  }

  /**
   * Отримати числове значення карти
   * @returns {number} 1-13
   */
  getRankValue() {
    if (this.rank === 'A') return 1;
    if (this.rank === 'J') return 11;
    if (this.rank === 'Q') return 12;
    if (this.rank === 'K') return 13;
    return parseInt(this.rank, 10);
  }

  /**
   * Унікальний ID карти (для подвійної колоди)
   * @returns {string}
   */
  getId() {
    return `${this.suit}-${this.rank}-${this.deckIndex}`;
  }

  /**
   * Перевірка еквівалентності карт
   * @param {Card} otherCard 
   * @returns {boolean}
   */
  equals(otherCard) {
    return this.suit === otherCard.suit && 
           this.rank === otherCard.rank && 
           this.deckIndex === otherCard.deckIndex;
  }

  /**
   * Серіалізація для передачі клієнту
   * @returns {Object}
   */
  toJSON() {
    return {
      suit: this.suit,
      rank: this.rank,
      deckIndex: this.deckIndex,
      id: this.getId()
    };
  }

  /**
   * Створення з JSON
   * @param {Object} json 
   * @returns {Card}
   */
  static fromJSON(json) {
    return new Card(json.suit, json.rank, json.deckIndex || 0);
  }
}

module.exports = Card;