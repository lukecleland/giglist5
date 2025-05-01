FROM node:20-slim

# Set working directory
WORKDIR /app

# Set environment
ENV NODE_ENV=development

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app files
COPY . .

# Expose dev server port
EXPOSE 3000

# Run dev server
CMD ["npm", "run", "dev"]
