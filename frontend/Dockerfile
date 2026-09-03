FROM node:20-alpine AS build

WORKDIR /app

# Accept env vars passed during Docker build
ARG VITE_API_BASE_URL
ARG VITE_API_SEARCH_URL

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_API_SEARCH_URL=$VITE_API_SEARCH_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Serve compiled static assets
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]