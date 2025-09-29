# Use Node.js 20 as base image (required for KendoReact)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (use npm install instead of ci for compatibility)
RUN npm install --omit=dev

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install serve globally
RUN npm install -g serve

# Expose port (Railway will set PORT env variable)
EXPOSE $PORT

# Start the application
CMD ["sh", "-c", "serve -s build -l ${PORT:-3000}"]
