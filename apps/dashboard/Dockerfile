FROM node:20-alpine as builder

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build dashboard
RUN npm run build:dashboard

# Use node to serve the app
FROM node:20-alpine

WORKDIR /app

# Install serve
RUN npm install -g serve

# Copy built assets from builder
COPY --from=builder /app/dist/apps/dashboard ./dist

EXPOSE 4000

# Serve the app
CMD ["serve", "-s", "dist", "-l", "4000"] 