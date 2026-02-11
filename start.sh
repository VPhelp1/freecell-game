#!/bin/bash
# Швидкий запуск FreeCell гри в браузері

echo "🎮 FreeCell - Локальний запуск"
echo "================================="
echo ""

# Перевірка на Python
if command -v python3 &> /dev/null; then
    echo "✅ Python3 знайдено"
    echo "Запускаю сервер на port 8000..."
    echo ""
    echo "🌐 Відкрий в браузері: http://localhost:8000"
    echo ""
    echo "Натисни Ctrl+C щоб зупинити"
    echo ""
    cd "$(dirname "$0")"
    python3 -m http.server 8000 --directory . --bind 0.0.0.0
elif command -v python &> /dev/null; then
    echo "✅ Python знайдено"
    echo "Запускаю сервер на port 8000..."
    echo ""
    echo "🌐 Відкрий в браузері: http://localhost:8000"
    echo ""
    echo "Натисни Ctrl+C щоб зупинити"
    echo ""
    cd "$(dirname "$0")"
    python -m SimpleHTTPServer 8000
elif command -v node &> /dev/null; then
    echo "✅ Node.js знайдено"
    echo "Створюю простий HTTP сервер..."
    echo ""
    cd "$(dirname "$0")"
    node -e "
        const http = require('http');
        const fs = require('fs');
        const path = require('path');
        const server = http.createServer((req, res) => {
            let filePath = '.' + req.url;
            if (filePath === './') filePath = './index.html';
            const extname = String(path.extname(filePath)).toLowerCase();
            const mimeTypes = {
                '.html': 'text/html',
                '.js': 'text/javascript',
                '.css': 'text/css',
                '.json': 'application/json'
            };
            const contentType = mimeTypes[extname] || 'application/octet-stream';
            fs.readFile(filePath, (error, content) => {
                if (error) {
                    if (error.code == 'ENOENT') {
                        res.writeHead(404, {'Content-Type': 'text/html'});
                        res.end('<h1>404 Not Found</h1>', 'utf-8');
                    } else {
                        res.writeHead(500);
                        res.end('Server Error: ' + error.code, 'utf-8');
                    }
                } else {
                    res.writeHead(200, {'Content-Type': contentType});
                    res.end(content, 'utf-8');
                }
            });
        });
        server.listen(8000, () => {
            console.log('🌐 Server running at http://localhost:8000/');
            console.log('Натисни Ctrl+C щоб зупинити');
        });
    "
else
    echo "❌ Помилка: Не знайдено Python або Node.js"
    echo ""
    echo "Встанови один з них:"
    echo "  - Python3: sudo apt-get install python3"
    echo "  - Node.js: curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt-get install -y nodejs"
    echo ""
    echo "Або просто відкрой файл index.html в браузері"
fi
