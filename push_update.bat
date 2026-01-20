@echo off
cd /d "d:\Antigravity-Homly app"
echo Working Directory: %cd%
git config --global --add safe.directory "d:/Antigravity-Homly app"
git config --global --add safe.directory "D:/Antigravity-Homly app"
git status
git add .
git commit -m "Config: Point Android to Vercel URL"
git push
echo ✅ Done!
pause
