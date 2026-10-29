#!/bin/sh
# Container start: migrate, create the example bag and the admin once, serve.
set -e
cd /app/apps/backend/.medusa/server
MEDUSA=/app/node_modules/.bin/medusa

$MEDUSA db:migrate

if [ "${SEED_EXAMPLE_BAG:-true}" = "true" ]; then
  $MEDUSA exec ./src/scripts/seed-segelstueck.js
fi

# Only the first start creates the admin; later starts keep the existing login.
if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
  if $MEDUSA user -e "$ADMIN_EMAIL" -p "$ADMIN_PASSWORD" >/tmp/admin.log 2>&1; then
    echo "Admin $ADMIN_EMAIL angelegt."
  else
    echo "Admin $ADMIN_EMAIL nicht angelegt (existiert vermutlich schon):"
    tail -n 3 /tmp/admin.log
  fi
fi

exec $MEDUSA start
