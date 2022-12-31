# Docker image.
FROM node:18.12-alpine

# Which user.
USER root

# Create app directory
WORKDIR /root/app

# Copy app directory.
COPY package*.json ./

# Node package install.
RUN npm install

# Run.
CMD ["npm", "start"]