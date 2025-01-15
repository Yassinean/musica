# Use Node.js as the base image
FROM node:alpine

# Copy package.json and package-lock.json files
COPY package.json ./

WORKDIR /app
COPY . /app

# Install Cli Angular
RUN npm install -g @angular/cli@17

# Install dependencies
RUN npm install

# Copy the rest of the application files


# Expose the Angular development server port (default is 4200)
EXPOSE 4200

# Command to start the Angular app
CMD ["ng", "serve", "--host", "0.0.0.0"]
