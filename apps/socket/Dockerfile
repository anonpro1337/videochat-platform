FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/socket/package.json ./apps/socket/
COPY packages/ ./packages/

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm build --filter=@videochat/socket

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/apps/socket/dist ./dist
COPY --from=builder /app/apps/socket/package.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 4001

CMD ["node", "dist/main.js"]
