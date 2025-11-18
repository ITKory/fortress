# ===== Builder =====
FROM node:20-alpine AS builder
WORKDIR /app

# Кэшируем зависимости
COPY package.json package-lock.json ./
RUN npm ci

# Копируем весь код и билдим
COPY . .
RUN npm run build

# ===== Runtime (минимальный образ) =====
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Не-root пользователь (безопасность)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем только то, что нужно для запуска (standalone-режим)
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Права на папки
USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
