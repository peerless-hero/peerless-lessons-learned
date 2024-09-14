---
title: 利用对象存储服务实现uniapp的热更新功能
description: 无需编写单独的后台代码，利用对象存储服务的交互，实现uniapp的热更新功能。
category:
  - 软件开发教程
tags:
  - uniapp
pubDate: 2024-09-12
cover: https://images.unsplash.com/photo-1516557070061-c3d1653fa646??w=1960&h=1102&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmxhY2t8ZW58MHwwfDB8fHwy
coverAlt: uniapp
author: peerless_hero
---
## 热更新的概念

热更新指的是在不停止应用的情况下，更新应用的功能、资源、界面等。

## 热更新优点

1. 节省流量：更新包的大小通常比客户端的资源文件小很多，因此可以节省流量。
2. 快速更新：如果采用整包更新的方式，每次发布都要提交应用商店审核，耗费时间，部分紧急错误问题难以被及时解决。

## 准备工作

1. **对象存储服务**：
   - 阿里云的OSS、腾讯云的COS、百度云的BOS等。
   - 需开通对象存储服务，并创建存储空间。

2. **一个uniapp项目**：
准备一个uniapp项目，并完成基本开发。

## 特别提醒

- 需要manifest.json文件的代码变更版本号 **versionName** 的配置。
- 如果修改了manifest.json文件 **versionName** 以外的配置，会导致SDK基座改变，导致热更新不兼容问题。这种情况请使用整包更新的方式更新APP。

## 核心要点

利用OSS的head请求，获得wgt热更新包的版本信息，根据业务逻辑判断是否提示用户更新。

## 实现步骤

1. 制作wgt热更新包，两种方式：
   - HbuildX：HBuilderX是uniapp官方IDE，可以将uniapp项目打包成安装包。
   - 使用cli方式运行 `npm run build:app`, 使用zip将 **dist/build/app** 内的所有文件压缩为后缀名为 **.wgt** 的压缩包。

2. 上传wgt热更新包到对象存储服务，设置为公共只读，并根据版本号添加Meta信息。例如，新版本 **versionName** 是 **1.1.0**, **versionCode** 是 **100**，则可以添加Meta信息为：**x-oss-meta-version-name: 1.1.0** ， **x-oss-meta-version-code: 100**

3. 设置路径规则，将此文件调整为公共只读；根据上传区域和存储路径，确定可供直接下载访问的URL。

4. 在uniapp项目中，配置热更新功能：
   - 在APP启动、APP手动检查更新等时机，向步骤3获得的URL发起head请求，可根据响应头的Meta信息，获得最新打APP版本号，在根据自己的判断逻辑，觉得是否提示用户更新。
   - 如果确定要更新，则下载wgt热更新包，并安装它。安装成功后，提醒用户重启应用。
   - 如果安装失败，则提示用户重新安装。

5. 使用云打包或离线打包的方式，将uniapp项目打包成安装包（apk或ipa）。

## 为什么要设计以上步骤？

- 大多数应用的更新其实并不需要用户登录，只需要获取到应用的最新版本号自行判断即可。OSS的head请求可以最简单的获取这些。
- 步骤1的构建和步骤2的上传，与常规的前端项目的构建和发布流程非常近似，使用常见的CI工具（如Jenkins、Gitlab CI）就可以完成。
- 基于自动化的CI流程，可以控制版本发布，节省人工操作的时间。
