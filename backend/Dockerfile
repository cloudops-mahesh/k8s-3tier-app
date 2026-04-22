# Stage 1 — Install dependencies
FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Stage 2 — Final image
FROM node:20-alpine
WORKDIR /app

# Copy dependencies from stage 1
COPY --from=dependencies /app/node_modules ./node_modules

# Copy app code
COPY . .

# Don't run as root (security best practice)
USER node

# Expose the port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]