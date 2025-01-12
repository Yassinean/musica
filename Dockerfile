# Step 1: Use Node.js to build the Angular app
FROM node:20 as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app files
COPY . .

# Build the Angular app
RUN npm run build --prod

# Step 2: Use Nginx to serve the Angular app
FROM nginx:stable-alpine

# Copy the built files from the build stage
COPY --from=build /app/dist/musica /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
