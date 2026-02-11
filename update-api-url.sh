#!/bin/bash
# Скрипт для оновлення API URL в frontend файлах

if [ -z "$1" ]; then
    echo "❌ Помилка: Вкажи Railway URL"
    echo "Використання: ./update-api-url.sh <RAILWAY_URL>"
    echo "Приклад: ./update-api-url.sh https://freecell-game.up.railway.app"
    exit 1
fi

RAILWAY_URL=$1
API_BASE="${RAILWAY_URL}/api/games"

echo "🔄 Оновлення API URL..."
echo "Railway URL: $RAILWAY_URL"
echo "API Base: $API_BASE"
echo ""

# Оновити docs/index.html
if [ -f "docs/index.html" ]; then
    sed -i "s|const API_BASE = '/api/games';|const API_BASE = '$API_BASE';|g" docs/index.html
    echo "✅ docs/index.html оновлено"
else
    echo "❌ docs/index.html не знайдено"
fi

# Оновити public/index.html
if [ -f "public/index.html" ]; then
    sed -i "s|const API_BASE = '/api/games';|const API_BASE = '$API_BASE';|g" public/index.html
    echo "✅ public/index.html оновлено"
else
    echo "❌ public/index.html не знайдено"
fi

echo ""
echo "📝 Перевір зміни:"
echo "grep API_BASE docs/index.html"
echo "grep API_BASE public/index.html"
echo ""
echo "💾 Закоммити і запушити:"
echo "git add docs/index.html public/index.html"
echo "git commit -m 'Update frontend API URL to Railway'"
echo "git push"
echo ""
echo "🎮 Тоді грай на: https://vphelp1.github.io/freecell-game/"
