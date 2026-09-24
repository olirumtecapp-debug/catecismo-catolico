@echo off
title Servidor Local - Catecismo & Auditoria de Santos
cd /d "D:\Catecismo"

set "GIT_EXE=git"
if exist "C:\Users\Murilo Pai\AppData\Local\GitHubDesktop\app-3.6.4\resources\app\git\cmd\git.exe" set "GIT_EXE=C:\Users\Murilo Pai\AppData\Local\GitHubDesktop\app-3.6.4\resources\app\git\cmd\git.exe"
if exist "C:\Program Files\Git\cmd\git.exe" set "GIT_EXE=C:\Program Files\Git\cmd\git.exe"

echo =======================================================
echo Sincronizando com a Nuvem (Backup Automatico)...
echo =======================================================
"%GIT_EXE%" pull origin main
echo =======================================================
echo Iniciando Servidor Catecismo e Auditoria...
echo =======================================================
start http://localhost:3000/auditoria.html
node server.mjs
pause

