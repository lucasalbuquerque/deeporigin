FROM node:18-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune web --docker

FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm install

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN npm install
RUN npm run build -- --filter=web...

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/web/package.json .
COPY --from=installer /app/apps/web/.next ./.next
COPY --from=installer /app/apps/web/public ./public
COPY --from=installer /app/node_modules ./node_modules

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "start"]