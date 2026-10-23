@echo off
title Menjalankan Server Mengenal Sudut
echo ====================================================
echo  Menjalankan Server Lokal Etnomatematika Sudut
echo  Alamat Web: http://localhost:8080/
echo ====================================================
echo Tekan Ctrl + C di jendela ini jika ingin mematikan server.
echo.
start http://localhost:8080/
php -S localhost:8080
pause
