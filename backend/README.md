# FreeCell Variants Backend

Backend сервер для підтримки різних варіантів гри FreeCell.

## Підтримувані варіанти

1. **Classic FreeCell** - стандартний FreeCell
2. **Baker's Game** - рухи тільки в тій же масті
3. **Eight Off** - 8 вільних комірок замість 4
4. **Double FreeCell** - подвійна колода (104 карти)

## Установка

```bash
cd backend
npm install
```

## Запуск

```bash
# Розробка
npm run dev

# Продакшн
npm start
```

## API Endpoints

### Отримати типи ігор
```
GET /api/games/types
```

### Створити нову гру
```
POST /api/games/create
Content-Type: application/json

{
  "gameType": "freecell" | "bakers_game" | "eight_off" | "double_freecell"
}
```

### Отримати стан гри
```
GET /api/games/:gameId
```

### Зробити хід
```
POST /api/games/:gameId/move
Content-Type: application/json

{
  "from": {
    "type": "tableau" | "freeCell" | "foundation",
    "index": 0,
    "key": "hearts" // для foundation
  },
  "to": {
    "type": "tableau" | "freeCell" | "foundation", 
    "index": 0,
    "key": "hearts" // для foundation
  }
}
```

### Скинути гру
```
POST /api/games/:gameId/reset
```

### Видалити гру
```
DELETE /api/games/:gameId
```

### Статистика
```
GET /api/games/stats/overview
```

## Структура проекту

```
backend/
├── src/
│   ├── controllers/     # Контролери API
│   ├── models/         # Моделі даних
│   │   └── games/      # Класи ігор
│   ├── routes/         # Маршрути
│   ├── services/       # Бізнес логіка
│   ├── types/          # Типи та константи
│   └── server.js       # Головний файл
├── tests/              # Тести
├── config/             # Конфігурація
└── package.json
```

## Архітектура

- **BaseGame** - базовий клас для всіх варіантів
- **Card** - модель карти
- **GameFactory** - фабрика для створення ігор
- **GameController** - обробка HTTP запитів

## Особливості варіантів

### Baker's Game
- Карти в таблоні можна класти тільки в тій же масті
- Складніший за звичайний FreeCell

### Eight Off
- 8 вільних комірок замість 4
- Легший за звичайний FreeCell

### Double FreeCell
- Дві колоди (104 карти)
- 8 вільних комірок
- 8 фундаментів (по 2 на кожну масть)
- 10 стовпців в таблоні

## Інтеграція з фронтендом

Backend надає REST API для управління грою. Фронтенд може:

1. Отримати список типів ігор
2. Створити нову гру обраного типу
3. Отримувати поточний стан гри
4. Надсилати ходи для валідації
5. Скидати/видаляти ігри

## WebSocket підтримка

Планується додати WebSocket для реального часу та мультиплеєра.