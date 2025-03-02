---
title: 搭建一个AI相册网站
description: 这是一个借助cloudflare和openai的相册网站，收集了我用AI工具生成的一些图片。
category:
  - 软件开发教程
tags:
  - rspack
  - ai
  - cloudflare
pubDate: 2025-03-03
cover: /src/assets/ai-album.png
coverAlt: 相册
author: peerless_hero
---

## 网站介绍

框架选用了vue3，打包构建工具是rspack，网站借助了cloudflare的pages服务托管。

## 项目思路

1. 用vue3和rspack搭建一个静态网站并将代码托管到github。
2. 借助Stable Diffusion web UI等工具生成图片，将图片放置到github仓库中。
3. 利用cloudflare的pages服务部署网站。

## 为什么要这样做

相当于把git仓库当成了图库。cloudflare的pages服务如果搭建静态服务是完全免费的，而且国内访问速度可以接受。

## 技术文档

[Stable Diffusion web UI](https://github.com/AUTOMATIC1111/stable-diffusion-webui)

[vue3](https://cn.vuejs.org/guide/introduction#introduction)

[rspack](https://rspack.dev/zh/)

[cloudflare](https://developers.cloudflare.com/pages/framework-guides/deploy-a-vue-site/)

## 网站源码

<https://github.com/peerless-hero/ai-album>

## 网站链接

<https://ai-album.peerless.vip/>
