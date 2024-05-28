FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN bun install

COPY . .

RUN bunx build

# Stage 2: Create the Nginx image with the built app
FROM nginx AS runner

COPY --from=build /app/build /usr/share/nginx/html

# Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]