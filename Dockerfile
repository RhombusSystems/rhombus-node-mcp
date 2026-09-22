# syntax=docker/dockerfile:1
FROM node:22 AS builder

WORKDIR /app

# Install build tools for native modules (faiss-node uses node-gyp)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm config set strict-ssl false && npm ci --ignore-scripts && npm rebuild faiss-node

COPY tsconfig.json ./
COPY src ./src
COPY assets ./assets
RUN npm run build

# ---- runtime ----
FROM node:22-slim

WORKDIR /app

RUN apt-get update && apt-get install -y libstdc++6 && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/assets ./assets
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

ENV PORT=3123
ENV TRANSPORT_TYPE=streamable-http

EXPOSE 3123

ENTRYPOINT ["node", "dist/index.js"]
