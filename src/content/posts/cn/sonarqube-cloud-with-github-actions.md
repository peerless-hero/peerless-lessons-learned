---
title: 开源项目如何利用免费的 SonarQube Cloud 和 GitHub Actions 实现代码扫描
description: 详细讲解如何为开源项目免费集成 SonarQube Cloud，搭配 GitHub Actions 自动执行代码质量扫描与安全分析，并展示项目仪表盘与 PR 反馈效果。
category:
  - 软件开发教程
tags:
  - SonarQube Cloud
  - GitHub Actions
  - CI
  - 代码质量
  - 代码扫描
pubDate: 2026-07-25
cover: /src/assets/sonarqube-logo.svg
coverAlt: SonarQube Cloud + GitHub Actions 代码扫描
author: peerless_hero
---

## 一、为什么需要代码扫描

在多人协作的开源项目中，代码质量问题往往容易被忽视：

- 团队成员编码风格不统一，维护成本越来越高
- 潜在的 Bug（空指针、未处理的异常、资源未释放）直到线上才暴露
- 安全漏洞（SQL 注入、XSS、硬编码密钥）藏匿在代码深处
- 代码重复率居高不下，重构意愿越来越低

**代码扫描** 就是为了解决这些问题而生——它像一位不知疲倦的自动化审阅者，在每次代码提交时自动检查每一行代码，发现质量缺陷、安全隐患和技术债务。

## 二、为什么选择 SonarQube Cloud

SonarQube 是业界最知名的代码质量平台之一，而 **SonarQube Cloud**（前身 SonarCloud）是其 SaaS 版本，无需自建服务器，免费套餐对开源项目极其友好：

| 特性                         | 免费套餐（开源项目） | 说明                                         |
| ---------------------------- | -------------------- | -------------------------------------------- |
| **代码分析**                 | ✅ 无限次扫描        | 每次 push 和 PR 自动触发                     |
| **语言支持**                 | 30+ 种语言           | Java、JS/TS、Python、Go、C# 等主流语言全覆盖 |
| **质量门禁（Quality Gate）** | ✅                   | 设定质量红线，未达标则阻断合并               |
| **PR 反馈**                  | ✅                   | 直接在 PR 中标注问题代码行                   |
| **安全热点**                 | ✅                   | 标记潜在安全风险并给出修复建议               |
| **技术债务追踪**             | ✅                   | 量化代码维护成本                             |
| **协作人数**                 | 无限制               | 适合开源社区协作                             |
| **存储空间**                 | 无限制               | 公共仓库无限制                               |

> 注意：免费套餐要求仓库是 **公开的（public）**，这正是开源项目的天然条件。私有仓库需要付费订阅。

### SonarQube Cloud vs 其他方案

| 方案                  | 优缺点                                               |
| --------------------- | ---------------------------------------------------- |
| **SonarQube Cloud**   | 免运维、免费、功能完整、社区认可度高                 |
| **自建 SonarQube**    | 需要服务器和维护成本，适合企业内部                   |
| **GitHub CodeQL**     | 免费但侧重安全扫描，代码质量分析不如 SonarQube 全面  |
| **ESLint / Prettier** | 仅覆盖代码风格和基础规则，无法检测复杂缺陷和安全漏洞 |

## 三、架构概览

整条流水线的运行流程如下：

```
开发者推送代码 → GitHub Actions 触发 → 安装依赖 → SonarQube Cloud 扫描 → 结果上传至 SonarQube Cloud → PR 注释/状态更新
```

每次代码推送，GitHub Actions 会自动拉取代码、安装依赖、执行 SonarQube Cloud 分析，分析结果同步回 GitHub，在 PR 页面直接展示质量门禁通过/失败状态，以及每个问题的具体位置。

## 四、准备工作

开始之前，你需要拥有：

1. 一个 **GitHub 公开仓库**（开源项目）
2. 一个 **SonarQube Cloud 账号**（使用 GitHub 账号登录即可）

### 4.1 注册并登录 SonarQube Cloud

1. 访问 [SonarQube Cloud](https://sonarcloud.io/)
2. 点击 **Log in**，选择 **Log in with GitHub**
3. 授权 SonarQube Cloud 访问你的 GitHub 账号

### 4.2 创建 SonarQube Cloud 项目

1. 登录成功后，点击右上角头像 → **My Account → Organizations**
2. 点击 **Create Organization**，创建你的组织（推荐使用 GitHub 组织名或个人用户名）
3. 创建完组织后，点击 **Analyze new project**
4. 选择你的 GitHub 仓库，点击 **Set up**
5. SonarQube Cloud 会自动创建一个项目，并生成一个 **Project Key** 和 **Organization Key**

记下这两个值，稍后在 `sonar-project.properties` 中使用。

### 4.3 生成 SonarQube Cloud Token

1. 在 SonarQube Cloud 中，点击右上角头像 → **My Account → Security**
2. 在 **Generate Token** 中输入 Token 名称（如 `github-actions`）
3. 点击 **Generate**，复制生成的 Token 值

> **安全提示**：Token 只在生成时显示一次，关闭页面后将无法再次查看。如果遗失，可以随时生成新 Token 并替换。

## 五、配置 GitHub Secrets

在 GitHub 仓库中配置 Secrets，让 GitHub Actions 工作流能够安全地使用 SonarQube Cloud Token。

1. 进入你的 GitHub 仓库
2. 点击 **Settings → Secrets and variables → Actions**
3. 点击 **New repository secret**
4. 添加以下 Secret：

| Secret 名称   | 说明                       | 从哪里获取                              |
| ------------- | -------------------------- | --------------------------------------- |
| `SONAR_TOKEN` | SonarQube Cloud 认证 Token | SonarQube Cloud → My Account → Security |

配置完成后，工作流可以通过 `${{ secrets.SONAR_TOKEN }}` 引用该 Token。

## 六、创建 SonarQube 配置文件

在项目根目录创建 `sonar-project.properties` 文件，这是 SonarQube 分析器的核心配置：

```properties
sonar.projectKey=your_project_key
sonar.organization=your_organization_key

# 项目名称（显示在 SonarQube Cloud 界面）
sonar.projectName=your-project-name

# 源代码目录
sonar.sources=src

# 排除文件（如测试文件、自动生成的代码）
sonar.exclusions=**/*.test.js,**/*.spec.js,**/node_modules/**,**/dist/**,**/build/**

# 语言（可选，自动检测）
sonar.language=ts
```

> 配置完成后，可以参考本项目实际使用的 `sonar-project.properties`：
>
> ```properties
> sonar.projectKey=q1nck7g935vzx2udr86mh0fpbeislo_peerless-lessons-learned
> sonar.organization=q1nck7g935vzx2udr86mh0fpbeislo
> sonar.projectName=peerless-lessons-learned
> ```

### sonar-project.properties 常用配置说明

| 配置项                              | 说明                   | 示例                              |
| ----------------------------------- | ---------------------- | --------------------------------- |
| `sonar.projectKey`                  | 项目唯一标识           | `my_org_my_repo`                  |
| `sonar.organization`                | 组织 Key               | `my_github_org`                   |
| `sonar.projectName`                 | 项目显示名称           | `My Project`                      |
| `sonar.sources`                     | 源代码目录，逗号分隔   | `src,lib`                         |
| `sonar.exclusions`                  | 排除的文件模式         | `**/*.test.js,**/node_modules/**` |
| `sonar.coverage.exclusions`         | 排除覆盖率统计的文件   | `**/*.config.ts`                  |
| `sonar.javascript.lcov.reportPaths` | 代码覆盖率报告路径     | `coverage/lcov.info`              |
| `sonar.tests`                       | 测试文件目录           | `test`                            |
| `sonar.verbose`                     | 开启详细日志（调试用） | `true`                            |

## 七、创建 GitHub Actions 工作流

在项目根目录创建 `.github/workflows/sonarcloud.yml` 文件：

```yaml
name: SonarCloud

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  pull-requests: read
  contents: read

jobs:
  sonarcloud:
    name: SonarCloud Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v7
        with:
          # 关闭浅克隆以获得更准确的分析结果（新代码检测、历史趋势）
          fetch-depth: 0

      - name: Setup pnpm
        uses: pnpm/action-setup@v6

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: 26
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: SonarCloud Scan
        uses: SonarSource/sonarqube-scan-action@v8
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

### 7.1 逐段解读

#### 触发条件

```yaml
on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened]
```

- `push`：推送到 `main` 分支时触发，用于跟踪主分支代码质量趋势
- `pull_request`：PR 打开、同步代码、重新打开时触发，用于在合并前发现问题

#### 权限设置

```yaml
permissions:
  pull-requests: read
  contents: read
```

遵循最小权限原则，只授予工作流所需的最低权限。

#### 完整检出

```yaml
- name: Checkout repository
  uses: actions/checkout@v7
  with:
    fetch-depth: 0
```

设置 `fetch-depth: 0` 非常重要——SonarQube 需要完整的 Git 历史来准确计算**新代码（New Code）** 差异和项目历史趋势。如果不设置，默认的浅克隆会导致扫描结果不准确。

#### 安装依赖

```yaml
- name: Setup pnpm
  uses: pnpm/action-setup@v6

- name: Setup Node.js
  uses: actions/setup-node@v6
  with:
    node-version: 26
    cache: pnpm

- name: Install dependencies
  run: pnpm install --frozen-lockfile
```

如果你的项目使用 JavaScript/TypeScript，建议在扫描前安装依赖。SonarQube 分析器可以读取 `node_modules` 中的类型定义，从而提供更准确的依赖分析。

#### 执行扫描

```yaml
- name: SonarCloud Scan
  uses: SonarSource/sonarqube-scan-action@v8
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

`SonarSource/sonarqube-scan-action@v8` 是官方提供的 SonarQube Cloud 扫描 Action，它会：

1. 自动识别项目根目录的 `sonar-project.properties`
2. 运行代码分析器对项目进行扫描
3. 将结果上传到 SonarQube Cloud
4. 在 PR 上添加 Quality Gate 状态检查

## 八、质量门禁（Quality Gate）

Quality Gate 是 SonarQube Cloud 的核心功能，它定义了一组质量标准作为"红线"。只有扫描结果满足所有标准，PR 才能通过质量门禁检查。

### 8.1 默认质量门禁标准

SonarQube Cloud 提供了一套默认的 Quality Gate 规则：

| 指标               | 阈值   | 说明                                       |
| ------------------ | ------ | ------------------------------------------ |
| **新增代码覆盖率** | < 80%  | 新增代码的测试覆盖率低于 80% 则标记失败    |
| **新增代码重复率** | > 3%   | 新增代码中重复代码比例超过 3% 则标记失败   |
| **新增代码通过率** | < 100% | 新增代码中有任何未通过的检查规则则标记失败 |
| **安全评级**       | 高于 A | 存在 blocker/critical 安全问题时标记失败   |

> 你可以根据项目实际情况在 SonarQube Cloud 控制台 **Quality Gates** 中自定义门禁规则。

### 8.2 在 GitHub PR 中查看效果

配置完成后，每次提交 PR 时：

1. SonarQube Cloud 自动开始扫描
2. PR 页面底部会显示 Quality Gate 状态（绿色通过 / 红色失败）
3. 扫描发现的问题会以 **代码注释** 的形式直接标注在对应的代码行上
4. PR 的 **Checks** 选项卡中可以看到详细的扫描报告

这种即时反馈机制，让开发者无需离开 GitHub 就能修复代码问题。

## 九、在 SonarQube Cloud 解读分析报告

扫描完成后，访问 SonarQube Cloud 的项目页面，可以看到丰富的代码质量数据：

### 9.1 仪表盘概览

项目主页展示以下关键指标：

- **Quality Gate 状态**：项目总体质量是否通过红线
- **Bug 数量**：代码中检测到的潜在缺陷，按严重程度分为 A-E 五个等级
- **漏洞（Vulnerabilities）**：安全漏洞数量
- **代码异味（Code Smells）**：代码质量问题（命名不规范、过长方法等）
- **覆盖率（Coverage）**：测试代码对业务代码的覆盖百分比
- **重复率（Duplications）**：代码重复的比例
- **技术债务（Technical Debt）**：估算修复所有问题所需的时间

### 9.2 问题的严重等级

SonarQube 将所有问题分为五个等级：

| 等级            | 标签 | 说明                                 |
| --------------- | ---- | ------------------------------------ |
| 🔴 **Blocker**  | 阻碍 | 极大概率导致生产事故的问题，必须修复 |
| 🟠 **Critical** | 严重 | 有较高概率导致 Bug，或存在安全风险   |
| 🟡 **Major**    | 主要 | 常见代码质量问题，可能引发小概率 Bug |
| 🔵 **Minor**    | 次要 | 轻微质量缺陷，不影响功能             |
| ⚪ **Info**     | 提示 | 改进建议，非强制要求                 |

### 9.3 安全热点（Security Hotspots）

SonarQube Cloud 还提供 **Security Hotspots** 功能，标记代码中可能存在安全风险的位置，例如：

- SQL 注入风险
- 跨站脚本（XSS）
- 硬编码密码或 API Key
- 不安全的加密算法
- 不正确的权限控制

每个安全热点都会标注风险等级，并给出修复建议。

## 十、本项目的实际配置

本项目 `peerless-lessons-learned` 已完整集成 SonarQube Cloud 代码扫描，你可以参考以下实际文件：

**`sonar-project.properties`**：

```properties
sonar.projectKey=q1nck7g935vzx2udr86mh0fpbeislo_peerless-lessons-learned
sonar.organization=q1nck7g935vzx2udr86mh0fpbeislo
sonar.projectName=peerless-lessons-learned
```

**`.github/workflows/sonarcloud.yml`**：

```yaml
name: SonarCloud

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  pull-requests: read
  contents: read

jobs:
  sonarcloud:
    name: SonarCloud Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v7
        with:
          fetch-depth: 0

      - name: Setup pnpm
        uses: pnpm/action-setup@v6

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: 26
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: SonarCloud Scan
        uses: SonarSource/sonarqube-scan-action@v8
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

## 十一、最佳实践与注意事项

### 11.1 选择合适的扫描触发策略

```yaml
on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
```

- **push 到主分支**：跟踪代码质量历史趋势
- **PR 扫描**：在合并前发现问题
- **不建议全部分支都触发**：Feature 分支频繁 push 会导致大量不必要的扫描

### 11.2 合理配置排除规则

在 `sonar-project.properties` 中排除不需要扫描的文件：

```properties
sonar.exclusions=**/*.test.*,**/*.spec.*,**/node_modules/**,**/dist/**,**/coverage/**,**/generated/**
sonar.coverage.exclusions=**/*.config.*,**/migrations/**
```

这样可以减少扫描噪音，让 SonarQube 聚焦于业务代码。

### 11.3 持续改进而非追求完美

- Quality Gate 的阈值应该**循序渐进**，初期不宜设置过高
- 重点关注 **Blocker** 和 **Critical** 级别的问题
- 代码异味和技术债务可以逐步清理，不必一次扫清
- 将代码质量改善纳入团队的开发流程，形成习惯

### 11.4 扫描失败后的处理

**情况一：偶尔的误报**

SonarQube 的某些规则可能不适合你的项目。你可以在 SonarQube Cloud 控制台中：

1. 进入项目 → **Administration → Analysis Scope → Issues**
2. 选择误报的问题，标记为 **Won't Fix** 或 **False Positive**

或者，在代码中使用注释忽略特定规则：

```javascript
// 下一行的 Sonar 规则将被跳过
// eslint-disable-some sonarjs/no-duplicate-string
const message = 'Hello World'
```

**情况二：确实存在质量问题**

最好的做法是：

1. 查看 SonarQube Cloud 仪表盘或 PR 上的问题列表
2. 逐一修复问题
3. 修复后代码会自动重新扫描（提交新 commit 或重新运行 workflow）

### 11.5 集成覆盖率报告（可选）

如果项目已配置测试覆盖率，可以将覆盖率报告集成到 SonarQube：

```properties
sonar.javascript.lcov.reportPaths=coverage/lcov.info
```

并在工作流中添加生成覆盖率报告的步骤：

```yaml
- name: Run tests with coverage
  run: pnpm test -- --coverage
```

## 十二、效果展示

完成全部配置后，你将获得以下能力：

1. **代码推送即扫描**：每次 `git push` 自动触发 SonarQube 分析
2. **PR 质量门禁**：Quality Gate 自动检查，不达标则阻止合并
3. **行内问题标注**：在 PR 的代码 diff 中直接显示问题位置
4. **历史趋势追踪**：在 SonarQube Cloud 仪表盘查看代码质量随时间的变化
5. **安全风险预警**：自动发现安全热点，防患于未然
6. **技术债务量化**：清楚知道项目需要多少投入来改善代码质量

## 十三、总结

通过本文的配置，我们为开源项目免费集成了企业级的代码扫描能力：

1. 使用 **SonarQube Cloud** 作为代码质量分析平台，零成本、免运维
2. 通过 **GitHub Actions** 自动触发扫描，无需人工介入
3. **Quality Gate** 在 PR 阶段拦截质量问题，确保主分支代码质量
4. **详细的分析报告**帮助团队持续改进代码质量

这套方案不仅适用于 Astro/JS/TS 项目，也适用于 **Java、Python、Go、C#、Kotlin、Ruby** 等语言的任意项目。只需调整 `sonar-project.properties` 中的相关配置，即可快速适配。

代码质量不是一蹴而就的，但有了 SonarQube Cloud 和 GitHub Actions 的自动化加持，保持代码健康变得前所未有的简单。

## 参考文档

- [SonarQube Cloud 官网](https://sonarcloud.io/)
- [SonarQube Cloud 文档](https://docs.sonarsource.com/sonarcloud/)
- [SonarQube Scan Action (GitHub Marketplace)](https://github.com/marketplace/actions/official-sonarqube-scan)
- [GitHub Actions 文档](https://docs.github.com/zh/actions)
- [SonarQube `sonar-project.properties` 配置说明](https://docs.sonarsource.com/sonarcloud/advanced-setup/analysis-parameters/)
- [Quality Gates 配置指南](https://docs.sonarsource.com/sonarcloud/quality-gates/)
