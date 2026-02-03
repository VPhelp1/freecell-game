# 🎮 FreeCell Variants

4 різні варіанти класичної гри FreeCell з backend валідацією на Node.js

## 🎯 Доступні варіанти

1. **Classic FreeCell** - стандартний варіант
2. **Baker's Game** - складніший, рухи тільки в тій же масті  
3. **Eight Off** - легший, з 8 вільними комірками
4. **Double FreeCell** - подвійна колода (104 карти)

## 🚀 Демо

**Живий демо:** [Посилання буде тут після деплою]

## 🏗️ Технології

- **Backend:** Node.js + Express
- **Frontend:** Vanilla HTML/CSS/JS  
- **API:** REST з валідацією ходів
- **Архітектура:** Модульна з BaseGame класом

## 🎮 Як грати

1. Відкрийте демо
2. Оберіть варіант гри
3. Натисніть "Грати"
4. Робіть ходи через інтерфейс

## 🛠️ Локальний запуск

```bash
# Клонуємо репозиторій
git clone https://github.com/VPhelp1/freecell-game.git
cd freecell-game

# Встановлюємо залежності
cd backend && npm install

# Запускаємо сервер
npm start
```

Сервер буде доступний на `http://localhost:3001`

## 📡 API Endpoints

- `GET /api/games/types` - список варіантів
- `POST /api/games/create` - створити гру
- `GET /api/games/:id` - стан гри
- `POST /api/games/:id/move` - зробити хід
- `POST /api/games/:id/reset` - скинути гру

## 📁 Структура

```
├── backend/          # Node.js сервер
│   ├── src/
│   │   ├── models/   # Моделі ігор
│   │   ├── controllers/
│   │   └── routes/
│   └── package.json
├── public/           # Статичний фронтенд
└── README.md
```

## 🎯 Особливості варіантів

### Baker's Game
- Карти можна класти тільки в тій же масті
- Складніший за звичайний FreeCell

### Eight Off  
- 8 вільних комірок замість 4
- Легший за звичайний FreeCell

### Double FreeCell
- Дві колоди (104 карти)
- 8 вільних комірок, 8 фундаментів  
- 10 стовпців в таблоні

## 👨‍💻 Автор

VPhelp1 - [GitHub](https://github.com/VPhelp1)

## 📄 Ліцензія

MIT