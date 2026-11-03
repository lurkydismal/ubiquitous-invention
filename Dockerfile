FROM node:current-alpine@sha256:c6ad9e9c1d80f6eb607c26b4b0a132ff7a2344fad1c78ea3baa2a7d4c8de6d94

# small runtime deps
RUN apk add --no-cache ca-certificates

# Set the working directory in the container
WORKDIR /app

# Copy package.json
COPY package.json .

# Install dependencies
RUN npm i

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

CMD ["npm", "run",  "start"]
