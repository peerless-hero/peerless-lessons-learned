# 静态化部署方案
# 需要先打包生成dist目录，然后运行
# 使用阿里云内部镜像仓库；云效环境下，凭证和推送镜像仓库一致
FROM nginx:1.27.3-alpine-slim

# 设置时区，使nginx日志的时间变为中国标准时间
ENV TZ=CST-8

# 此配置可以通过yml的configs选项覆盖
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 放置在根目录，方便查找
COPY dist /app
