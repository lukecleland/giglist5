FROM node:20-slim AS builder

WORKDIR /app

ENV NODE_ENV=development

COPY package*.json ./
RUN npm install --production=false

COPY . .

RUN npm run build

FROM node:20-slim

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
