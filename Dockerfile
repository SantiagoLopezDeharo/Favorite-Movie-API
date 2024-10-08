# Use official Node.js image
FROM node:latest

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 8080 to the host
EXPOSE 8080

# Command to run the application
CMD ["npm", "start"]
