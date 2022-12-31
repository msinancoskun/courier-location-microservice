# Docker image.
FROM node:14.17-alpine

# Which user.
USER root

# Create app directory
WORKDIR /root/app

# Copy app directory.
COPY . .

# Node package install.
RUN npm install

# Run.
CMD ["npm", "start"]