# ─── Build stage ──────────────────────────────────────────────────────────────
FROM oven/bun:1-alpine AS build
WORKDIR /app

# Install dependencies first so this layer is cached until the lockfile changes.
# bunfig.toml makes `bun run` use the Bun runtime rather than Node.
COPY package.json bun.lock bunfig.toml ./
RUN bun install --frozen-lockfile

# vite.config.ts imports .figma/make/site.json, so it must be in the context
COPY . .
RUN bun run build

# ─── Runtime stage — static files served by nginx ────────────────────────────
FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

# Writes /config.js (API_URL, PORTAL_DOMAIN) from the container env at every start,
# so the same image serves local, staging or live — set the vars in Coolify.
COPY --chmod=755 docker/40-app-config.sh /docker-entrypoint.d/40-app-config.sh

EXPOSE 1111

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:1111/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
