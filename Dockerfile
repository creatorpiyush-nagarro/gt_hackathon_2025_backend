# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set environment variables
ENV NODE_ENV=production

# Set the working directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package*.json ./

# Install app dependencies and PM2 globally in one layer
RUN npm install && npm install -g pm2

ENV PM2_PUBLIC_KEY wdokbz3zp5ahtzo
ENV PM2_SECRET_KEY zobramt82pgilcm

# Copy application code
COPY . .

# Expose the application's port
EXPOSE 3000

# Use pm2-runtime for proper Docker integration
CMD ["pm2-runtime", "server.js"]