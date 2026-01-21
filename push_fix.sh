#!/bin/bash
cd /Users/john/Desktop/Thaiconnect
git add -A
git commit -m "fix: Change Transaction field names to snake_case (created_at, refunded_at)"
git push origin main
echo "=== DONE ==="
git log --oneline -3
