# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and yarn.lock files to the working directory
COPY --chown=node:node  package.json package-lock.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the application code to the working directory
COPY . ./

# Build the TypeScript code
RUN npm run build

# Set the command to run the application
EXPOSE 4000

CMD ["npm", "run", "start"]