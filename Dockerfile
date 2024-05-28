FROM oven/bun:canary-alpine AS build

WORKDIR /bachhoasi

COPY package*.json ./

RUN bun install

COPY . .

RUN bun run build

FROM nginx:alpine AS runner

COPY --from=build /bachhoasi/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
COPY --from=build /bachhoasi/dist .

CMD ["nginx", "-g", "daemon off;"]