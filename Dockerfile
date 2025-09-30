FROM node:22.12.0-alpine AS build-stage

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM nginx:1.27.3-alpine-slim AS production-stage

# 设置时区，使nginx日志的时间变为中国标准时间
ENV TZ=CST-8

expose 80

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist /usr/share/nginx/html
