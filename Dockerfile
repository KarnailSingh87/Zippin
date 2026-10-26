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
ENV MONGO_URI="mongodb+srv://mk2251842_db_user:30y3SYcdhns1eige@cluster0.bdczfs1.mongodb.net/zippin?retryWrites=true&w=majority"


# Start backend server
CMD ["node", "src/index.js"]
