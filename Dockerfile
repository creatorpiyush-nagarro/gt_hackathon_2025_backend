# Use a modern LTS Node.js base image
FROM node:20-alpine

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Set working directory
WORKDIR /usr/src/app

# Install necessary native packages for better compatibility with node modules (optional but safe)
RUN apk add --no-cache bash

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --omit=dev && npm install -g pm2

# Copy the entire application
COPY . .

# Expose app port
EXPOSE 3000

# Use pm2-runtime for better Docker signal handling (avoids zombie processes, crash on SIGINT)
CMD ["pm2-runtime", "server.js"]
