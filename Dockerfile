# ---------- build stage ----------
FROM node:current-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json .

# Install dependencies
RUN npm i

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# ---------- runtime stage ----------
FROM nginx:alpine AS runner

# small runtime deps
RUN apk add --no-cache ca-certificates

WORKDIR /

# copy compiled app from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Insert try_files index.html in location /
RUN sed -i '/location \/ {/a\\ttry_files $uri /index.html;' /etc/nginx/conf.d/default.conf

# Insert /api/ location before location /
RUN sed -i '/location \/ {/i \
    location /api/ {\n\
    proxy_pass http://localhost/;\n\
    proxy_http_version 1.1;\n\
    proxy_set_header Upgrade $http_upgrade;\n\
    proxy_set_header Connection "upgrade";\n\
    proxy_set_header Host $host;\n\
    proxy_cache_bypass $http_upgrade;\n\
    }\n' /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g",  "daemon off;"]
