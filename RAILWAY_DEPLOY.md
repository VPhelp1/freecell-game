# 🚀 Railway Deployment Guide

## Швидкий старт (5 хвилин)

### 1. Підключи Railway GitHub

Перейди на: https://railway.app/new

1. Натисни **"Deploy from GitHub repo"**
2. Вибери репозиторій: `VPhelp1/freecell-game`
3. Railway автоматично вичитає `railway.toml`

### 2. Конфігурація Railway

Railway автоматично налаштує:
- **Build:** `npm install`
- **Start:** `node backend/src/server.js`
- **Port:** 3001 (автоматично)
- **Environment:** `NODE_ENV=production`

### 3. Дочекайся деплойменту

- Зазвичай займає 2-3 хвилини
- Побачиш зелений статус ✅

### 4. Отримай API URL

Railway видасть URL на кшталт:
`https://freecell-game.up.railway.app`

### 5. Онови frontend

Редагуй `docs/index.html` (і `public/index.html`):

Знайди рядок:
```javascript
const API_BASE = '/api/games';
```

Зміни на:
```javascript
const API_BASE = 'https://freecell-game.up.railway.app/api/games';
```

### 6. Закоммити і запуши

```bash
git add docs/index.html public/index.html
git commit -m "Update frontend API URL for Railway"
git push
```

### 7. Грай! 🎮

Відкрий: **https://vphelp1.github.io/freecell-game/**

---

## Альтернатива: Railway CLI

Якщо є `railway` CLI:

```bash
# Логін
railway login

# Створити проект
railway init

# Додати змінні середовища
railway variables set NODE_ENV=production

# Деплой
railway up

# Отримати URL
railway domain
```

---

## Перевірка деплойменту

### Тест backend:
```bash
curl https://freecell-game.up.railway.app/
```

Має повернути:
```json
{
  "version": "1.0.0",
  "message": "Welcome to FreeCell Variants API"
}
```

### Тест створення гри:
```bash
curl -X POST https://freecell-game.up.railway.app/api/games/create \
  -H "Content-Type: application/json" \
  -d '{"gameType":"freecell"}'
```

---

## Переваги Railway

✅ **Безкоштовно** для невеликих проектів
✅ **Автоматичний деплой** з GitHub
✅ **HTTPS** автоматично
✅ **Custom domains** (можна додати свій)
✅ **Log viewing** онлайн
✅ **Environment variables** легко налаштувати

---

## Вартість

- **Free tier:** $5/місяць
  - 500 MB RAM
  - 1 GB Disk
  - 512 MB/hour execution time

Більше ніж достатньо для гри! 🎮

---

## Якщо не працює

1. **Перевір логи** в Railway dashboard
2. **Перевір PORT** - Railway автоматично надає порт через `process.env.PORT`
3. **Перевір environment variables**

---

## Наступні покращення

- [ ] Додати health check endpoint
- [ ] Налаштувати automatic scaling
- [ ] Додати monitoring (Sentry, LogRocket)
- [ ] Add custom domain
