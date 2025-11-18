# ===== Builder =====
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci --omit=dev && npm run build

# ===== Runner =====
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем ВСЁ из standalone (Next.js 14.2+ сам корректно обрабатывает src/)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Если используешь middleware или что-то из корня — иногда нужно:
# COPY --from=builder /app/next.config.js ./
# COPY --from=builder /app/middleware.js ./

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
