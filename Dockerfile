FROM node:22.12.0-alpine AS build-stage

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY .npmrc ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM nginx:1.27.3-alpine-slim AS production-stage

# Grant write permissions to nginx user for cache and log directories (required for non-root operation)
RUN chown -R nginx:nginx /var/cache/nginx /var/log/nginx

EXPOSE 80

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist /usr/share/nginx/html

# Switch to non-root user following the principle of least privilege
USER nginx
