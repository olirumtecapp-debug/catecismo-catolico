@echo off
title Servidor Local - Catecismo & Auditoria de Santos
cd /d "D:\Catecismo"
echo =======================================================
echo Sincronizando com a Nuvem (Backup Automático)...
echo =======================================================
"C:\Program Files\Verdent\resources\app.asar.unpacked\node_modules\dugite\git\cmd\git.exe" pull origin main
echo =======================================================
echo Iniciando Servidor Catecismo & Auditoria...
echo =======================================================
start http://localhost:3000/auditoria.html
node server.mjs
pause
