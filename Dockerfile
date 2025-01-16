# Stage 1: Build
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Install dependencies based on the package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies with caching
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .
RUN rm -f public/assets/env.txt

# Build the application
RUN yarn build

# Stage 2: Production
FROM nginx:stable-alpine

# Copy the built files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the default nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf


# Running ENVSUBST
ADD docker/startup.sh /startup.sh
RUN ["chmod", "+x", "/startup.sh"]
CMD /startup.sh

# Expose the port nginx will run on
EXPOSE 80