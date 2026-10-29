#!/bin/sh
# Container start: fetch the publishable key, build once per configuration, serve.
set -e
cd /app/apps/storefront
BIN=/app/node_modules/.bin

# Server-side calls stay inside the Docker network.
export NEXT_PUBLIC_MEDUSA_BACKEND_URL="${MEDUSA_INTERNAL_URL:-http://backend:9000}"

echo "Warte auf den Publishable Key vom Backend ..."
until NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$(node -e "
  fetch(process.argv[1] + '/segelstueck/storefront-key')
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((j) => console.log(j.token), () => process.exit(1))
" "$NEXT_PUBLIC_MEDUSA_BACKEND_URL"); do
  sleep 3
done
export NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

# NEXT_PUBLIC_* values are baked into the build, so rebuild when one changes.
STAMP="$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY|$NEXT_PUBLIC_MEDUSA_BACKEND_URL|$NEXT_PUBLIC_BASE_URL|$NEXT_PUBLIC_DEFAULT_REGION|$MEDUSA_PUBLIC_URL"
if [ ! -f .next/BUILD_ID ] || [ "$(cat .next/deploy-stamp 2>/dev/null)" != "$STAMP" ]; then
  echo "Baue den Shop (dauert ein paar Minuten) ..."
  $BIN/next build
  echo "$STAMP" > .next/deploy-stamp
fi

exec $BIN/next start -p 8000
