# syntax=docker/dockerfile:1

FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ---- deps ----
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Payload reads the config at build time to generate the admin bundle.
# DATABASE_URI is not contacted during build; a placeholder keeps it happy.
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URI=postgres://placeholder:placeholder@localhost:5432/placeholder
ENV PAYLOAD_SECRET=placeholder-build-secret
RUN npm run build

# ---- runner ----
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# sharp is a native dependency and is not traced into standalone reliably.
COPY --from=deps /app/node_modules/sharp ./node_modules/sharp

USER nextjs

# Port is a default, not a fixed value: set PORT in the deploy environment to
# move it. The Next standalone server reads it at boot.
#
# Note this is the port *inside* the container. It does not collide with
# anything on the host, because the container has its own network namespace, and
# the reverse proxy reaches it over the Docker network. If the proxy returns 502,
# the usual cause is the proxy being pointed at a different port than this one.
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
EXPOSE 3000

# Schema is created by the `migrate` service in docker-compose.yml, which runs
# the builder stage once before this container starts. It is not done here: the
# runtime image is a standalone bundle without the Payload CLI or the TS config,
# and `push` is off outside development, so nothing creates tables on its own.
CMD ["node", "server.js"]
