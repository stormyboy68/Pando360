# مرحله 1: بیلد
#FROM node:20.11-alpine AS builder
#
#WORKDIR /app
#COPY package*.json ./
#RUN npm install --legacy-peer-deps
#COPY . .
#RUN npm run build
#
## مرحله 2: اجرای سبک‌تر
#FROM node:20.11-alpine
#
#WORKDIR /app
#
#COPY --from=builder /app ./
#COPY --from=builder /app/.next .next
#COPY --from=builder /app/public ./public
#COPY --from=builder /app/package.json ./
#COPY --from=builder /app/node_modules ./node_modules
#
#EXPOSE 3000

#ENV NODE_ENV=production

#CMD ["npx", "next", "start"]

# Dockerfile.dev
FROM node:20.11-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

# کپی نمی‌کنیم کل سورس رو! فقط توی volume خواهد بود
EXPOSE 3000

CMD ["npx", "next", "dev"]
#CMD ["npx", "next", "dev"]