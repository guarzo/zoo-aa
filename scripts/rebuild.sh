#!/bin/bash
set -e

echo "=== Starting Alliance Auth Rebuild ==="

echo "[1/5] Building containers (no cache)..."
docker compose build --no-cache

echo "[2/5] Stopping containers..."
docker compose down

echo "[3/5] Starting containers..."
docker compose --env-file=.env up -d

echo "[4/5] Running migrations..."
docker exec allianceauth_gunicorn python manage.py migrate

echo "[5/5] Collecting static files..."
docker exec allianceauth_gunicorn python manage.py collectstatic --noinput

echo "=== Rebuild Complete ==="
echo "Alliance Auth is now running!"
