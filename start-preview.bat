@echo off
chcp 65001 > nul
echo Запуск локальной витрины макетов...
start http://localhost:4173
node server.js
pause
