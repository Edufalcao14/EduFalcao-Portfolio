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
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
