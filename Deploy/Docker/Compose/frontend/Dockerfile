# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application for production
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config for React SPA support
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port the app runs on
EXPOSE 3000

# Nginx starts automatically in the foreground when the container starts