@echo off
cd /d "d:\Antigravity-Homly app"
echo Working Directory: %cd%
git config --global --add safe.directory "d:/Antigravity-Homly app"
git config --global --add safe.directory "D:/Antigravity-Homly app"
git status
git add .
git commit -m "Fix: Admin Store Images"
git push
echo ✅ Done!
pause
