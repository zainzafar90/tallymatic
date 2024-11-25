# Base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first for caching dependencies
COPY package*.json ./

# Install dependencies for the monorepo
RUN npm install

# Copy the rest of the application files
COPY . .

# Install concurrently globally to run both frontend and backend
RUN npm install -g concurrently

# Expose the ports for both frontend (4200) and backend (3000)
EXPOSE 4200 3000 

# Command to run both frontend and backend
CMD ["npm", "run", "dev"]
