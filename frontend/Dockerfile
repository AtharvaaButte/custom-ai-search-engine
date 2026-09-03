# --- Stage 1: Build the Vite production assets ---
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Stage 2: Serve static files with Nginx ---
FROM nginx:alpine

# Copy built static files from Stage 1 into Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose standard HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]