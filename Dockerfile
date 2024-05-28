FROM oven/bun AS build

WORKDIR /app

COPY package*.json ./

RUN bun install

COPY . .

RUN bun run build

# Stage 2: Create the Nginx image with the built app
FROM nginx AS runner

COPY --from=build /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]