#!/usr/bin/env bash
# Sets up the local Segelstueck demo. Safe to run repeatedly:
# existing .env files, products, orders and the admin user are kept.
set -euo pipefail
cd "$(dirname "$0")/.."

run() { if command -v mise >/dev/null 2>&1; then mise exec -- "$@"; else "$@"; fi; }

echo "1/6 Datenbank starten"
docker compose up -d --wait

echo "2/6 Abhängigkeiten installieren"
[ -d node_modules ] || run npm install

echo "3/6 Backend-Konfiguration"
if [ ! -f apps/backend/.env ]; then
  sed -e "s/^JWT_SECRET=.*/JWT_SECRET=$(openssl rand -hex 32)/" \
      -e "s/^COOKIE_SECRET=.*/COOKIE_SECRET=$(openssl rand -hex 32)/" \
      apps/backend/.env.template > apps/backend/.env
fi
[ -f apps/backend/.env.test ] || cp apps/backend/.env.test.template apps/backend/.env.test

echo "4/6 Migrationen und Beispieltasche"
(cd apps/backend && run npx medusa db:migrate && run npx medusa exec ./src/scripts/seed-segelstueck.ts)

echo "5/6 Storefront-Konfiguration"
KEY=$(docker compose exec -T postgres psql -U segelstueck -d segelstueck -tAc \
  "select token from api_key where type='publishable' and title='Segelstueck Storefront' and revoked_at is null limit 1")
[ -f apps/storefront/.env.local ] || cp apps/storefront/.env.template apps/storefront/.env.local
sed -i.bak "s#^NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=.*#NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${KEY}#" apps/storefront/.env.local
rm -f apps/storefront/.env.local.bak

echo "6/6 Admin-Zugang"
# Decide by database state, not by the credentials file: after a database
# reset the old file still exists but the user is gone.
USERS=$(docker compose exec -T postgres psql -U segelstueck -d segelstueck -tAc \
  "select count(*) from \"user\" where deleted_at is null")
if [ "${USERS:-0}" = "0" ]; then
  mkdir -p .local
  PW=$(openssl rand -base64 18 | tr -d '/+=')
  (cd apps/backend && run npx medusa user -e admin@segelstueck.local -p "$PW")
  printf 'Medusa Admin (nur lokal)\nURL: http://localhost:9000/app\nE-Mail: admin@segelstueck.local\nPasswort: %s\n' "$PW" > .local/admin-zugang.txt
  chmod 600 .local/admin-zugang.txt
fi

echo
echo "Fertig. Starten mit: npm run dev"
echo "Shop:  http://localhost:8000"
echo "Admin: http://localhost:9000/app  (Zugang in .local/admin-zugang.txt)"
