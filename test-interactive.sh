#!/bin/bash

# 🎮 Інтерактивний тестер FreeCell API
API_BASE="http://localhost:3001/api/games"

echo "🎮 FREECELL VARIANTS ТЕСТЕР"
echo "=========================="

function show_menu() {
    echo ""
    echo "Виберіть дію:"
    echo "1) Показати типи ігор"
    echo "2) Створити Classic FreeCell"
    echo "3) Створити Baker's Game"  
    echo "4) Створити Eight Off"
    echo "5) Створити Double FreeCell"
    echo "6) Показати стан гри"
    echo "7) Зробити хід"
    echo "8) Скинути гру"
    echo "9) Статистика"
    echo "0) Вийти"
    echo ""
    read -p "Ваш вибір: " choice
}

function show_game_types() {
    echo ""
    echo "📋 ДОСТУПНІ ВАРІАНТИ:"
    echo "===================="
    curl -s "$API_BASE/types" | jq -r '.data[] | "• \(.name)\n  \(.description)\n  Особливості: \(.features.freeCells) вільних комірок, \(.features.decks) колода(и)\n"'
}

function create_game() {
    local game_type=$1
    local game_name=$2
    
    echo ""
    echo "🎯 Створюємо $game_name..."
    
    RESPONSE=$(curl -s -X POST "$API_BASE/create" \
        -H "Content-Type: application/json" \
        -d "{\"gameType\": \"$game_type\"}")
    
    if [ "$(echo $RESPONSE | jq -r '.success')" = "true" ]; then
        CURRENT_GAME_ID=$(echo $RESPONSE | jq -r '.data.gameId')
        echo "✅ Гру створено!"
        echo "   ID: $CURRENT_GAME_ID"
        echo "   Тип: $(echo $RESPONSE | jq -r '.data.gameState.config.name')"
        echo ""
        echo "📊 Початковий стан:"
        echo $RESPONSE | jq -r '.data.gameState.tableau | to_entries[] | "   Стовп \(.key): \(.value | length) карт"'
        echo "   Вільні комірки: $(echo $RESPONSE | jq -r '.data.gameState.config.freeCells')"
        
        # Зберігаємо ID в файл
        echo $CURRENT_GAME_ID > /tmp/current_game_id
    else
        echo "❌ Помилка: $(echo $RESPONSE | jq -r '.error')"
    fi
}

function show_game_state() {
    if [ ! -f /tmp/current_game_id ]; then
        echo "❌ Немає активної гри. Спочатку створіть гру."
        return
    fi
    
    GAME_ID=$(cat /tmp/current_game_id)
    
    echo ""
    echo "🎮 Поточний стан гри:"
    echo "===================="
    
    RESPONSE=$(curl -s "$API_BASE/$GAME_ID")
    
    if [ "$(echo $RESPONSE | jq -r '.success')" = "true" ]; then
        echo "   Тип: $(echo $RESPONSE | jq -r '.data.config.name')"
        echo "   Ходів: $(echo $RESPONSE | jq -r '.data.moveCount')" 
        echo "   Перемога: $(echo $RESPONSE | jq -r '.data.gameWon')"
        echo ""
        echo "📊 Таблон:"
        echo $RESPONSE | jq -r '.data.tableau | to_entries[] | "   Стовп \(.key): \(.value | length) карт" + (if .value | length > 0 then " (верх: \(.value[-1].suit) \(.value[-1].rank))" else "" end)'
        echo ""
        echo "🔓 Вільні комірки:"
        echo $RESPONSE | jq -r '.data.freeCells | to_entries[] | "   Комірка \(.key): " + (if .value then "\(.value.suit) \(.value.rank)" else "пуста" end)'
    else
        echo "❌ Помилка: $(echo $RESPONSE | jq -r '.error')"
    fi
}

function make_move() {
    if [ ! -f /tmp/current_game_id ]; then
        echo "❌ Немає активної гри. Спочатку створіть гру."
        return
    fi
    
    GAME_ID=$(cat /tmp/current_game_id)
    
    echo ""
    echo "🎯 ЗРОБИТИ ХІД"
    echo "=============="
    echo "Типи позицій: tableau (таблон), freeCell (вільна комірка), foundation (фундамент)"
    echo ""
    
    read -p "Звідки (тип): " from_type
    read -p "Звідки (індекс 0-9): " from_index
    read -p "Куди (тип): " to_type
    read -p "Куди (індекс 0-9): " to_index
    
    if [ "$to_type" = "foundation" ]; then
        read -p "Масть (hearts/diamonds/clubs/spades): " to_key
        TO_JSON="{\"type\": \"$to_type\", \"index\": $to_index, \"key\": \"$to_key\"}"
    else
        TO_JSON="{\"type\": \"$to_type\", \"index\": $to_index}"
    fi
    
    RESPONSE=$(curl -s -X POST "$API_BASE/$GAME_ID/move" \
        -H "Content-Type: application/json" \
        -d "{\"from\": {\"type\": \"$from_type\", \"index\": $from_index}, \"to\": $TO_JSON}")
    
    if [ "$(echo $RESPONSE | jq -r '.success')" = "true" ]; then
        echo ""
        echo "✅ Хід успішний!"
        echo "   Карта: $(echo $RESPONSE | jq -r '.data.move.card.suit') $(echo $RESPONSE | jq -r '.data.move.card.rank')"
        echo "   Ходів всього: $(echo $RESPONSE | jq -r '.data.gameState.moveCount')"
        
        if [ "$(echo $RESPONSE | jq -r '.data.gameState.gameWon')" = "true" ]; then
            echo "🏆 ВІТАЮ! ВИ ПЕРЕМОГЛИ!"
        fi
    else
        echo "❌ Хід неможливий: $(echo $RESPONSE | jq -r '.error')"
    fi
}

# Основний цикл
while true; do
    show_menu
    
    case $choice in
        1) show_game_types ;;
        2) create_game "freecell" "Classic FreeCell" ;;
        3) create_game "bakers_game" "Baker's Game" ;;
        4) create_game "eight_off" "Eight Off" ;;
        5) create_game "double_freecell" "Double FreeCell" ;;
        6) show_game_state ;;
        7) make_move ;;
        8) 
            if [ -f /tmp/current_game_id ]; then
                GAME_ID=$(cat /tmp/current_game_id)
                curl -s -X POST "$API_BASE/$GAME_ID/reset" > /dev/null
                echo "🔄 Гру скинуто!"
            else
                echo "❌ Немає активної гри."
            fi
            ;;
        9) 
            echo ""
            curl -s "$API_BASE/stats/overview" | jq -r '"📊 СТАТИСТИКА:\nВсього ігор: \(.data.totalGames)"'
            ;;
        0) 
            echo "👋 До побачення!"
            rm -f /tmp/current_game_id
            exit 0
            ;;
        *) echo "❌ Невірний вибір. Спробуйте ще раз." ;;
    esac
done