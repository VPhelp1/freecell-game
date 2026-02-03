#!/bin/bash

# 🧪 Тестування FreeCell API через curl
API_BASE="http://localhost:3001/api/games"

echo "🚀 Тестування FreeCell API"
echo "=========================="

echo ""
echo "1️⃣ Перевірка статусу API..."
curl -s http://localhost:3001/ | jq .

echo ""
echo "2️⃣ Отримання списку типів ігор..."
curl -s "$API_BASE/types" | jq .

echo ""
echo "3️⃣ Створення нової гри Classic FreeCell..."
GAME_RESPONSE=$(curl -s -X POST "$API_BASE/create" \
  -H "Content-Type: application/json" \
  -d '{"gameType": "freecell"}')

echo $GAME_RESPONSE | jq .

# Отримуємо gameId для подальших тестів
GAME_ID=$(echo $GAME_RESPONSE | jq -r '.data.gameId')

if [ "$GAME_ID" != "null" ] && [ "$GAME_ID" != "" ]; then
    echo ""
    echo "🎮 Game ID: $GAME_ID"
    
    echo ""
    echo "4️⃣ Отримання стану гри..."
    curl -s "$API_BASE/$GAME_ID" | jq .
    
    echo ""
    echo "5️⃣ Спроба ходу (таблон 0 -> вільна комірка 0)..."
    curl -s -X POST "$API_BASE/$GAME_ID/move" \
      -H "Content-Type: application/json" \
      -d '{
        "from": {"type": "tableau", "index": 0},
        "to": {"type": "freeCell", "index": 0}
      }' | jq .
    
    echo ""
    echo "6️⃣ Спроба ходу (таблон 1 -> таблон 2)..."
    curl -s -X POST "$API_BASE/$GAME_ID/move" \
      -H "Content-Type: application/json" \
      -d '{
        "from": {"type": "tableau", "index": 1},
        "to": {"type": "tableau", "index": 2}
      }' | jq .
    
    echo ""
    echo "7️⃣ Скидання гри..."
    curl -s -X POST "$API_BASE/$GAME_ID/reset" | jq .
    
    echo ""
    echo "8️⃣ Статистика..."
    curl -s "$API_BASE/stats/overview" | jq .
    
else
    echo "❌ Не вдалося створити гру"
fi

echo ""
echo "=========================="
echo "✅ Тестування завершено!"