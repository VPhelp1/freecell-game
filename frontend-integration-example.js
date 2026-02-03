/**
 * Приклад інтеграції фронтенда з backend API
 * Цей файл показує як підключити існуючий HTML FreeCell до нового backend
 */

class FreeCellAPIClient {
  constructor(baseUrl = 'http://localhost:3001/api/games') {
    this.baseUrl = baseUrl;
    this.currentGameId = null;
  }

  /**
   * Отримати доступні типи ігор
   */
  async getGameTypes() {
    const response = await fetch(`${this.baseUrl}/types`);
    const data = await response.json();
    return data.data;
  }

  /**
   * Створити нову гру
   */
  async createGame(gameType) {
    const response = await fetch(`${this.baseUrl}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameType })
    });
    
    const data = await response.json();
    if (data.success) {
      this.currentGameId = data.data.gameId;
      return data.data;
    }
    throw new Error(data.error);
  }

  /**
   * Отримати стан гри
   */
  async getGameState() {
    if (!this.currentGameId) throw new Error('Немає активної гри');
    
    const response = await fetch(`${this.baseUrl}/${this.currentGameId}`);
    const data = await response.json();
    return data.data;
  }

  /**
   * Зробити хід
   */
  async makeMove(from, to) {
    if (!this.currentGameId) throw new Error('Немає активної гри');
    
    const response = await fetch(`${this.baseUrl}/${this.currentGameId}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to })
    });
    
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
    throw new Error(data.error);
  }

  /**
   * Скинути гру
   */
  async resetGame() {
    if (!this.currentGameId) throw new Error('Немає активної гри');
    
    const response = await fetch(`${this.baseUrl}/${this.currentGameId}/reset`, {
      method: 'POST'
    });
    
    const data = await response.json();
    return data.data;
  }
}

/**
 * Адаптер для інтеграції з існуючим фронтенд кодом
 */
class BackendGameAdapter {
  constructor() {
    this.apiClient = new FreeCellAPIClient();
    this.localGame = null; // Існуючий локальний об'єкт гри
  }

  /**
   * Створити нову гру з вибором варіанту
   */
  async startNewGame(gameType = 'freecell') {
    try {
      const gameData = await this.apiClient.createGame(gameType);
      this.syncWithBackend(gameData.gameState);
      return gameData.gameState;
    } catch (error) {
      console.error('Помилка створення гри:', error);
      // Fallback до локальної гри
      return this.startLocalGame();
    }
  }

  /**
   * Зробити хід з валідацією на backend
   */
  async makeMove(from, to) {
    try {
      const result = await this.apiClient.makeMove(from, to);
      this.syncWithBackend(result.gameState);
      return result;
    } catch (error) {
      console.error('Помилка ходу:', error);
      // Можна fallback до локальної валідації
      throw error;
    }
  }

  /**
   * Синхронізація стану з backend
   */
  syncWithBackend(gameState) {
    // Тут би оновлювався існуючий UI
    console.log('Синхронізація з backend:', gameState);
    
    // Приклад оновлення UI:
    // this.updateTableau(gameState.tableau);
    // this.updateFreeCells(gameState.freeCells);
    // this.updateFoundations(gameState.foundations);
    
    if (gameState.gameWon) {
      this.showWinMessage();
    }
  }

  /**
   * Відображення переможного повідомлення
   */
  showWinMessage() {
    const winMessage = document.getElementById('win-message');
    if (winMessage) {
      winMessage.style.display = 'block';
    }
  }

  /**
   * Fallback до локальної гри
   */
  startLocalGame() {
    // Використання існуючої логіки
    if (window.FreeCellGame) {
      this.localGame = new window.FreeCellGame();
      return this.localGame;
    }
  }
}

/**
 * Приклад використання в існуючому коді
 */
document.addEventListener('DOMContentLoaded', async () => {
  const gameAdapter = new BackendGameAdapter();
  
  // Показати селектор варіантів гри
  const gameTypes = await gameAdapter.apiClient.getGameTypes();
  createGameTypeSelector(gameTypes);
  
  // Оновити існуючий обробник кнопки "Нова гра"
  const newGameBtn = document.getElementById('new-game-btn');
  if (newGameBtn) {
    newGameBtn.onclick = async () => {
      const selectedType = getSelectedGameType();
      await gameAdapter.startNewGame(selectedType);
    };
  }
});

/**
 * Створити селектор типів ігор
 */
function createGameTypeSelector(gameTypes) {
  const controlsDiv = document.querySelector('.controls');
  
  const selector = document.createElement('select');
  selector.id = 'game-type-selector';
  selector.style.marginRight = '10px';
  selector.style.padding = '10px';
  selector.style.fontSize = '16px';
  
  gameTypes.forEach(gameType => {
    const option = document.createElement('option');
    option.value = gameType.type;
    option.textContent = gameType.name;
    selector.appendChild(option);
  });
  
  controlsDiv.insertBefore(selector, controlsDiv.firstChild);
}

/**
 * Отримати вибраний тип гри
 */
function getSelectedGameType() {
  const selector = document.getElementById('game-type-selector');
  return selector ? selector.value : 'freecell';
}

// Експортуємо для використання в модульній системі
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FreeCellAPIClient, BackendGameAdapter };
}