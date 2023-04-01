# Base image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy the package files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code to the container
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port your app listens on
EXPOSE 3000

# Start the app
CMD [ "npm", "run", "start" ]
