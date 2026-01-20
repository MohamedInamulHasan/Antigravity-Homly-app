@echo off
cd /d "d:\Antigravity-Homly app"
echo Working Directory: %cd%
git config --global --add safe.directory "d:/Antigravity-Homly app"
git config --global --add safe.directory "D:/Antigravity-Homly app"
git status
git add .
git commit -m "Fix: Implemented Hybrid Auth (Cookies + Token) and fixed Production API URL for Android"
git push
echo ✅ Done!
pause
