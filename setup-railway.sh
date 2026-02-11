#!/bin/bash
# Скрипт для швидкого налаштування Railway deployment

echo "🚀 FreeCell Variants - Railway Deployment Setup"
echo "================================================"
echo ""

# Перевірка чи встановлений railway CLI
if command -v railway &> /dev/null; then
    echo "✅ Railway CLI знайдено"
    echo ""
    echo "Виконуй наступні команди:"
    echo ""
    echo "1. railway login"
    echo "2. railway init"
    echo "3. railway up"
    echo "4. railway domain"
    echo ""
    echo "Після отримання Railway URL, онови:"
    echo "  - docs/index.html"
    echo "  - public/index.html"
    echo ""
    echo "Знайди рядок: const API_BASE = '/api/games';"
    echo "Зміни на: const API_BASE = 'https://<YOUR_RAILWAY_URL>/api/games';"
else
    echo "❌ Railway CLI не встановлено"
    echo ""
    echo "🌐 Для швидкого деплойменту:"
    echo "1. Перейди на: https://railway.app/new"
    echo "2. Натисни 'Deploy from GitHub repo'"
    echo "3. Вибери репозиторій: VPhelp1/freecell-game"
    echo "4. Railway автоматично прочитає railway.toml"
    echo "5. Дочекайся деплойменту (2-3 хвилини)"
    echo ""
    echo "📝 Після деплойменту:"
    echo "1. Скопійуй Railway URL з dashboard"
    echo "2. Відкрий файл: docs/index.html"
    echo "3. Знайди: const API_BASE = '/api/games';"
    echo "4. Зміни на: const API_BASE = 'https://<RAILWAY_URL>/api/games';"
    echo "5. Повтори для public/index.html"
    echo "6. git commit і git push"
    echo ""
    echo "🎮 Тоді грай на: https://vphelp1.github.io/freecell-game/"
fi

echo ""
echo "📖 Детальніше дивись: RAILWAY_DEPLOY.md"
echo ""
