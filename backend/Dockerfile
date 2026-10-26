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
ENV MONGO_URI="mongodb+srv://mk2251842_db_user:30y3SYcdhns1eige@cluster0.bdczfs1.mongodb.net/zippin?retryWrites=true&w=majority"


# Start Express server
CMD ["node", "src/index.js"]

