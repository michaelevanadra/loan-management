# Build Stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all the source files
COPY . .

# Build the app
RUN npm run build

# Serve Stage (Nginx)
FROM nginx:alpine

# Copy the build files from the build stage to Nginx's html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port
EXPOSE 80

# Start the nginx server
CMD ["nginx", "-g", "daemon off;"]