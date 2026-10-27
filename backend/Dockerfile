FROM node:18-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy backend source code
COPY . .

# Expose backend port
EXPOSE 4000

ENV NODE_ENV=production
ENV PORT=4000

# Start Express server
CMD ["node", "src/index.js"]

