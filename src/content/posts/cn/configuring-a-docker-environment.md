---
title: 搭建Docker环境教程
description: Docker是一种流行的容器化平台，它通过打包应用程序及其依赖项到一个轻量级的容器中，解决了应用程序开发和部署过程中的一致性和可移植性问题。以下是搭建Docker环境的基本步骤，适用于大多数Linux发行版，如Ubuntu、CentOS等。
category:
  - 软件开发教程
tags:
  - Docker
pubDate: 2024-09-12
cover: https://images.unsplash.com/photo-1516557070061-c3d1653fa646??w=1960&h=1102&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmxhY2t8ZW58MHwwfDB8fHwy
coverAlt: 这是二十多年前的事
author: peerless_hero
---

### 一、准备工作

1. **系统要求**：
   - 确保你的系统满足Docker的最低要求，如CentOS系统的内核版本高于3.10。
   - 使用`uname -r`命令查看内核版本，如不满足要求，需进行升级。

2. **更新系统**（以CentOS为例）：
   - 执行`sudo yum update`命令，确保yum包管理器及其依赖项是最新的。

### 二、卸载旧版本（如已安装）

如果系统中已安装旧版本的Docker，建议先卸载，以避免版本冲突。
- 执行`sudo yum remove docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine`命令卸载旧版本。

### 三、设置Docker仓库

1. **安装必要的工具包**：
   - 执行`sudo yum install -y yum-utils`命令安装yum-utils，以便使用yum-config-manager工具。

2. **添加Docker仓库**：
   - 执行`sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo`命令，为Docker CE添加新的仓库。

### 四、安装Docker CE

1. **安装Docker CE及其依赖项**：
   - 执行`sudo yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin`命令，安装Docker CE、CLI、containerd.io和Docker Compose插件。

2. **启动Docker服务**：
   - 执行`sudo systemctl start docker`命令启动Docker服务。

3. **设置Docker开机启动**：
   - 执行`sudo systemctl enable docker`命令，确保Docker在系统启动时自动运行。

### 五、验证Docker安装

1. **查看Docker版本**：
   - 执行`docker version`命令，查看Docker的客户端和服务器版本信息，确认安装成功。

2. **拉取并运行Hello-World镜像**：
   - 执行`docker pull hello-world`命令从Docker Hub拉取Hello-World镜像。
   - 执行`docker run hello-world`命令运行Hello-World镜像，验证Docker的安装和运行是否正常。

### 六、配置Docker镜像源（可选）

为了提高拉取Docker镜像的速度，可以配置国内的Docker镜像源。

1. **创建Docker配置文件目录**：
   - 执行`sudo mkdir -p /etc/docker`命令创建Docker配置文件目录。

2. **编辑Docker配置文件**：
   - 执行`sudo tee /etc/docker/daemon.json <<-'EOF'`，然后粘贴以下内容（以阿里云镜像源为例）：
     ```json
     {
       "registry-mirrors": ["https://your-mirror-accel.mirror.aliyuncs.com"]
     }
     EOF
     ```
   - 注意替换`https://your-mirror-accel.mirror.aliyuncs.com`为你的实际镜像源地址。

3. **重新加载Docker配置并重启Docker服务**：
   - 执行`sudo systemctl daemon-reload`命令重新加载Docker配置。
   - 执行`sudo systemctl restart docker`命令重启Docker服务。

### 七、使用Docker

至此，Docker环境已搭建完成，你可以开始使用Docker进行容器化应用的开发、部署和管理了。例如，你可以从Docker Hub拉取官方镜像，创建并运行自己的容器，或者通过Dockerfile构建自定义镜像等。

请注意，由于Docker的版本和特性会随着时间更新和变化，建议参考官方文档以获取最新、最准确的信息。
