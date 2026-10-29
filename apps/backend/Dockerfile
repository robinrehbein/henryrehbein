# Medusa backend with Admin. Build context: repository root.
FROM node:24.18.0-bookworm-slim

WORKDIR /app

# Only the backend workspace is installed; the root lockfile pins every version.
COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/
COPY apps/storefront/package.json apps/storefront/
RUN npm ci --workspace @dtc/backend --no-audit --no-fund

COPY apps/backend apps/backend
WORKDIR /app/apps/backend
# medusa build compiles TypeScript only; the seed's bag photos are copied by hand.
RUN npx medusa build \
  && mkdir -p .medusa/server/src/scripts \
  && cp -r src/scripts/assets .medusa/server/src/scripts/ \
  && chmod +x docker-entrypoint.sh

ENV NODE_ENV=production
EXPOSE 9000
HEALTHCHECK --interval=10s --timeout=5s --start-period=120s --retries=12 \
  CMD node -e "fetch('http://localhost:9000/health').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"
ENTRYPOINT ["/app/apps/backend/docker-entrypoint.sh"]
