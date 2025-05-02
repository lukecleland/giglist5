FROM node:20-slim

# Set working directory
WORKDIR /app

# Install dependencies early to cache them
COPY package*.json ./

RUN rm -rf .next

RUN npm install

# Copy the rest of your app
COPY . .

# Expose the port Next.js runs on
EXPOSE 3000

# Start the Next.js dev server
CMD ["npm", "run", "dev"]
