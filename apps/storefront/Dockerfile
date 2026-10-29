# Next.js storefront. Build context: repository root.
#
# The production build runs when the container starts, not in the image: the
# publishable key only exists once the backend has migrated its database.
FROM node:24.18.0-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/
COPY apps/storefront/package.json apps/storefront/
RUN npm ci --workspace @dtc/storefront --no-audit --no-fund

COPY apps/storefront apps/storefront
RUN chmod +x apps/storefront/docker-entrypoint.sh

ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 8000
HEALTHCHECK --interval=10s --timeout=5s --start-period=600s --retries=6 \
  CMD node -e "fetch('http://localhost:8000/de').then(r=>process.exit(r.status<500?0:1),()=>process.exit(1))"
ENTRYPOINT ["/app/apps/storefront/docker-entrypoint.sh"]
