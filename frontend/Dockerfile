
# Use Node.js official image for building
FROM node:18 as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the entire frontend source code
COPY . .

# Build the frontend
RUN npm run build

# Use Nginx to serve the built frontend
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the frontend port
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

