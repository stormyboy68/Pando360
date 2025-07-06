FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000
ENV NODE_ENV=development

CMD ["npm", "run", "dev"]
# مرحله build
# FROM node:22 AS builder

# WORKDIR /app

# COPY package*.json ./
# RUN npm install --legacy-peer-deps

# COPY . .
# RUN npm run build

# # مرحله production
# FROM node:22-alpine

# WORKDIR /app

# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json

# ENV NODE_ENV=production
# EXPOSE 3000

# # CMD ["npx","next", "start"]
# CMD ["npm", "start"]
