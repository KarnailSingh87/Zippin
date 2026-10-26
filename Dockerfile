FROM node:18-alpine

WORKDIR /app

# Copy backend package manifests
COPY backend/package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy backend source code
COPY backend/ ./

# Expose backend port
EXPOSE 4000

ENV NODE_ENV=production

# Start backend server
CMD ["node", "src/index.js"]
