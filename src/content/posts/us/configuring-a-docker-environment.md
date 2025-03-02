---
title: Configuring a Docker Environment
description: Docker is a popular containerization platform that enables the packaging of applications and their dependencies into lightweight containers, addressing consistency and portability issues during application development and deployment. Below is a basic step-by-step guide to setting up a Docker environment, which is applicable to most Linux distributions such as Ubuntu, CentOS, and more.
category:
  - DevGuide
tags:
  - Docker
pubDate: 2024-09-12
cover: /src/assets/docker-logo.jpg
coverAlt: Docker Logo
author: peerless_hero
---

### Step 1: Preparation

1. **System Requirements**:
   - Ensure your system meets Docker's minimum requirements, such as having a kernel version higher than 3.10 for CentOS.
   - Use the `uname -r` command to check your kernel version and upgrade if necessary.

2. **Update Your System** (Example for CentOS):
   - Execute `sudo yum update` to ensure your yum package manager and its dependencies are up-to-date.

### Step 2: Uninstall Older Versions (if installed)

If you have older versions of Docker installed, it's recommended to uninstall them first to avoid version conflicts.

Execute `sudo yum remove docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine` to uninstall older versions.

### Step 3: Set Up the Docker Repository

1. **Install Necessary Tools**:
   - Execute `sudo yum install -y yum-utils` to install yum-utils, which provides the `yum-config-manager` utility.

2. **Add the Docker Repository**:
   - Execute `sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo` to add the new repository for Docker CE.

### Step 4: Install Docker CE

1. **Install Docker CE and Dependencies**:
   - Execute `sudo yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin` to install Docker CE, the CLI, containerd.io, and Docker Compose plugins.

2. **Start the Docker Service**:
   - Execute `sudo systemctl start docker` to start the Docker service.

3. **Enable Docker on Boot**:
   - Execute `sudo systemctl enable docker` to ensure Docker starts automatically on system boot.

### Step 5: Verify Docker Installation

1. **Check Docker Version**:
   - Execute `docker version` to view the client and server version information of Docker, confirming a successful installation.

2. **Pull and Run the Hello-World Image**:
   - Execute `docker pull hello-world` to pull the Hello-World image from Docker Hub.
   - Execute `docker run hello-world` to run the Hello-World image, verifying Docker's installation and operation.

### Step 6: Configure Docker Mirrors (Optional)

To improve the speed of pulling Docker images, you can configure a domestic Docker mirror.

1. **Create the Docker Configuration Directory**:
   - Execute `sudo mkdir -p /etc/docker` to create the Docker configuration directory.

2. **Edit the Docker Configuration File**:
Execute `sudo tee /etc/docker/daemon.json <<-'EOF'` and paste the following content (using Alibaba Cloud's mirror as an example):

```sh
{
  "registry-mirrors": ["https://your-mirror-accel.mirror.aliyuncs.com"]
}
EOF
```

Replace `https://your-mirror-accel.mirror.aliyuncs.com` with your actual mirror address.

1. **Reload Docker Configuration and Restart the Service**:
   - Execute `sudo systemctl daemon-reload` to reload the Docker configuration.
   - Execute `sudo systemctl restart docker` to restart the Docker service.

### Step 7: Using Docker

Your Docker environment is now set up, and you can start using Docker for containerized application development, deployment, and management. For example, you can pull official images from Docker Hub, create and run your own containers, or build custom images using Dockerfiles.

Please note that Docker's versions and features evolve over time, so refer to the official documentation for the latest and most accurate information.
