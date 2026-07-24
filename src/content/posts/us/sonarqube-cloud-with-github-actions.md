---
title: How to Set Up Free Code Scanning for Open Source Projects with SonarQube Cloud and GitHub Actions
description: A step-by-step guide on integrating SonarQube Cloud with GitHub Actions for automated code quality scanning and security analysis in open source projects, including dashboard insights and PR feedback.
category:
  - Software Development Tutorials
tags:
  - SonarQube Cloud
  - GitHub Actions
  - CI
  - Code Quality
  - Code Scanning
pubDate: 2026-07-25
cover: /src/assets/sonarqube-logo.svg
coverAlt: SonarQube Cloud + GitHub Actions Code Scanning
author: peerless_hero
---

## 1. Why Code Scanning Matters

In open source projects with multiple contributors, code quality issues are often overlooked:

- Inconsistent coding styles across team members, increasing maintenance costs
- Potential bugs (null pointers, unhandled exceptions, unreleased resources) that only surface in production
- Security vulnerabilities (SQL injection, XSS, hardcoded secrets) hiding deep in the codebase
- High code duplication rates, diminishing motivation for refactoring

**Code scanning** is designed to solve these problems — it acts as a tireless automated reviewer that inspects every line of code on each commit, detecting quality defects, security risks, and technical debt.

## 2. Why Choose SonarQube Cloud

SonarQube is one of the most renowned code quality platforms in the industry. **SonarQube Cloud** (formerly SonarCloud) is its SaaS version — no need to self-host, and the free plan is extremely friendly to open source projects:

| Feature                     | Free Plan (Open Source) | Details                                                |
| --------------------------- | ----------------------- | ------------------------------------------------------ |
| **Code Analysis**           | ✅ Unlimited scans      | Automatically triggered on every push and PR           |
| **Language Support**        | 30+ languages           | Full coverage of Java, JS/TS, Python, Go, C#, and more |
| **Quality Gate**            | ✅                      | Set quality thresholds; block merges if not met        |
| **PR Feedback**             | ✅                      | Annotate problematic lines directly in the PR diff     |
| **Security Hotspots**       | ✅                      | Flag potential security risks with fix recommendations |
| **Technical Debt Tracking** | ✅                      | Quantify code maintenance cost                         |
| **Team Members**            | Unlimited               | Perfect for open source collaboration                  |
| **Storage**                 | Unlimited               | No limits for public repositories                      |

> Note: The free plan requires repositories to be **public**, which is the natural state of open source projects. Private repositories require a paid subscription.

### SonarQube Cloud vs Alternatives

| Solution                  | Pros / Cons                                                                         |
| ------------------------- | ----------------------------------------------------------------------------------- |
| **SonarQube Cloud**       | Zero maintenance, free, feature-rich, widely adopted by the community               |
| **Self-hosted SonarQube** | Requires server and maintenance; suitable for enterprise use                        |
| **GitHub CodeQL**         | Free but security-focused; code quality analysis is less comprehensive              |
| **ESLint / Prettier**     | Only cover code style and basic rules; cannot detect complex bugs or security flaws |

## 3. Architecture Overview

The pipeline runs as follows:

```
Developer pushes code → GitHub Actions triggers → Install dependencies → SonarQube Cloud scans → Results uploaded to SonarQube Cloud → PR comments / status updates
```

On every code push, GitHub Actions automatically checks out the code, installs dependencies, runs SonarQube Cloud analysis, and syncs the results back to GitHub — displaying Quality Gate pass/fail status and the exact location of each issue directly on the PR page.

## 4. Prerequisites

Before you begin, you need:

1. A **GitHub public repository** (open source project)
2. A **SonarQube Cloud account** (sign in with your GitHub account)

### 4.1 Sign Up and Log In to SonarQube Cloud

1. Visit [SonarQube Cloud](https://sonarcloud.io/)
2. Click **Log in**, then select **Log in with GitHub**
3. Authorize SonarQube Cloud to access your GitHub account

### 4.2 Create a SonarQube Cloud Project

1. After logging in, click your avatar in the top-right → **My Account → Organizations**
2. Click **Create Organization** to create your organization (use your GitHub organization name or personal username)
3. Once the organization is created, click **Analyze new project**
4. Select your GitHub repository and click **Set up**
5. SonarQube Cloud will automatically create a project and generate a **Project Key** and **Organization Key**

Note down these two values — you'll use them later in `sonar-project.properties`.

### 4.3 Generate a SonarQube Cloud Token

1. In SonarQube Cloud, click your avatar in the top-right → **My Account → Security**
2. In the **Generate Token** field, enter a token name (e.g., `github-actions`)
3. Click **Generate** and copy the generated token value

> **Security Tip**: The token is displayed only once. You won't be able to see it again after closing the page. If lost, you can generate a new token at any time.

## 5. Configure GitHub Secrets

Configure Secrets in your GitHub repository so the GitHub Actions workflow can securely access the SonarQube Cloud token.

1. Go to your GitHub repository
2. Click **Settings → Secrets and variables → Actions**
3. Click **New repository secret**
4. Add the following Secret:

| Secret Name   | Description                          | Where to Get It                         |
| ------------- | ------------------------------------ | --------------------------------------- |
| `SONAR_TOKEN` | SonarQube Cloud authentication token | SonarQube Cloud → My Account → Security |

Once configured, the workflow can reference the token via `${{ secrets.SONAR_TOKEN }}`.

## 6. Create the SonarQube Configuration File

Create a `sonar-project.properties` file in the project root directory — this is the core configuration for the SonarQube analyzer:

```properties
sonar.projectKey=your_project_key
sonar.organization=your_organization_key

# Project name (displayed on the SonarQube Cloud dashboard)
sonar.projectName=your-project-name

# Source code directories
sonar.sources=src

# Files to exclude (e.g., test files, auto-generated code)
sonar.exclusions=**/*.test.js,**/*.spec.js,**/node_modules/**,**/dist/**,**/build/**

# Language (optional, auto-detected)
sonar.language=ts
```

> After configuration, refer to the actual `sonar-project.properties` used by this project:
>
> ```properties
> sonar.projectKey=q1nck7g935vzx2udr86mh0fpbeislo_peerless-lessons-learned
> sonar.organization=q1nck7g935vzx2udr86mh0fpbeislo
> sonar.projectName=peerless-lessons-learned
> ```

### Common `sonar-project.properties` Configuration Options

| Property                            | Description                         | Example                           |
| ----------------------------------- | ----------------------------------- | --------------------------------- |
| `sonar.projectKey`                  | Unique project identifier           | `my_org_my_repo`                  |
| `sonar.organization`                | Organization Key                    | `my_github_org`                   |
| `sonar.projectName`                 | Project display name                | `My Project`                      |
| `sonar.sources`                     | Source directories, comma-separated | `src,lib`                         |
| `sonar.exclusions`                  | File patterns to exclude            | `**/*.test.js,**/node_modules/**` |
| `sonar.coverage.exclusions`         | Files to exclude from coverage      | `**/*.config.ts`                  |
| `sonar.javascript.lcov.reportPaths` | Code coverage report path           | `coverage/lcov.info`              |
| `sonar.tests`                       | Test file directory                 | `test`                            |
| `sonar.verbose`                     | Enable verbose logging (debugging)  | `true`                            |

## 7. Create the GitHub Actions Workflow

Create `.github/workflows/sonarcloud.yml` in the project root directory:

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
          # Disable shallow clone for more accurate analysis (new code detection, historical trends)
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

### 7.1 Step-by-Step Breakdown

#### Trigger Conditions

```yaml
on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened]
```

- `push`: Triggers on pushes to the `main` branch to track code quality trends
- `pull_request`: Triggers when PRs are opened, synchronized (new commits pushed), or reopened — to catch issues before merging

#### Permission Settings

```yaml
permissions:
  pull-requests: read
  contents: read
```

Follows the principle of least privilege, granting only the minimum permissions the workflow needs.

#### Full Checkout

```yaml
- name: Checkout repository
  uses: actions/checkout@v7
  with:
    fetch-depth: 0
```

Setting `fetch-depth: 0` is critical — SonarQube needs the full Git history to accurately compute **New Code** differences and project historical trends. Without this, the default shallow clone will lead to inaccurate analysis results.

#### Install Dependencies

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

If your project uses JavaScript/TypeScript, it is recommended to install dependencies before scanning. The SonarQube analyzer can read type definitions from `node_modules` to provide more accurate dependency analysis.

#### Run the Scan

```yaml
- name: SonarCloud Scan
  uses: SonarSource/sonarqube-scan-action@v8
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

`SonarSource/sonarqube-scan-action@v8` is the official SonarQube Cloud scanning Action. It will:

1. Automatically detect `sonar-project.properties` in the project root
2. Run the code analyzer to scan the project
3. Upload the results to SonarQube Cloud
4. Add a Quality Gate status check to the PR

## 8. Quality Gate

The Quality Gate is a core feature of SonarQube Cloud. It defines a set of quality standards as a "red line." A PR can only pass the quality gate check if the scan results satisfy all criteria.

### 8.1 Default Quality Gate Criteria

SonarQube Cloud provides a set of default Quality Gate rules:

| Metric                   | Threshold | Description                                            |
| ------------------------ | --------- | ------------------------------------------------------ |
| **New Code Coverage**    | < 80%     | Fails if test coverage of new code is below 80%        |
| **New Code Duplication** | > 3%      | Fails if duplicated code in new code exceeds 3%        |
| **New Code Pass Rate**   | < 100%    | Fails if any check rule is violated in new code        |
| **Security Rating**      | Above A   | Fails if there are blocker or critical security issues |

> You can customize the Quality Gate rules in the SonarQube Cloud dashboard under **Quality Gates** based on your project's needs.

### 8.2 Viewing Results in GitHub PRs

Once configured, every time you submit a PR:

1. SonarQube Cloud automatically starts scanning
2. The Quality Gate status (green = pass / red = fail) is displayed at the bottom of the PR page
3. Issues found during the scan are annotated as **inline code comments** directly on the affected lines
4. A detailed scan report is available in the **Checks** tab of the PR

This real-time feedback mechanism allows developers to fix code issues without leaving GitHub.

## 9. Interpreting the Analysis Report in SonarQube Cloud

After the scan completes, visit the project page on SonarQube Cloud to see a wealth of code quality data:

### 9.1 Dashboard Overview

The project homepage displays the following key metrics:

- **Quality Gate Status**: Whether the overall project quality passes the red line
- **Bug Count**: Potential defects detected in the code, graded A–E by severity
- **Vulnerabilities**: Number of security vulnerabilities
- **Code Smells**: Code quality issues (poor naming conventions, overly long methods, etc.)
- **Coverage**: Percentage of business code covered by tests
- **Duplications**: Percentage of duplicated code
- **Technical Debt**: Estimated time to fix all identified issues

### 9.2 Issue Severity Levels

SonarQube classifies all issues into five severity levels:

| Level           | Label         | Description                                                                         |
| --------------- | ------------- | ----------------------------------------------------------------------------------- |
| 🔴 **Blocker**  | Blocking      | Issues with a very high probability of causing production incidents — must be fixed |
| 🟠 **Critical** | Critical      | High probability of causing bugs or posing security risks                           |
| 🟡 **Major**    | Major         | Common code quality issues that may cause occasional bugs                           |
| 🔵 **Minor**    | Minor         | Minor quality defects that do not affect functionality                              |
| ⚪ **Info**     | Informational | Improvement suggestions, not mandatory                                              |

### 9.3 Security Hotspots

SonarQube Cloud also provides **Security Hotspots**, marking locations in the code where potential security risks may exist, such as:

- SQL injection risks
- Cross-site scripting (XSS)
- Hardcoded passwords or API keys
- Unsafe cryptographic algorithms
- Incorrect permission controls

Each security hotspot is tagged with a risk level and comes with recommended fixes.

## 10. Actual Configuration of This Project

The `peerless-lessons-learned` project has fully integrated SonarQube Cloud code scanning. You can refer to the actual files below:

**`sonar-project.properties`**:

```properties
sonar.projectKey=q1nck7g935vzx2udr86mh0fpbeislo_peerless-lessons-learned
sonar.organization=q1nck7g935vzx2udr86mh0fpbeislo
sonar.projectName=peerless-lessons-learned
```

**`.github/workflows/sonarcloud.yml`**:

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

## 11. Best Practices and Considerations

### 11.1 Choose the Right Scan Trigger Strategy

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

- **Push to main branch**: Track code quality historical trends
- **PR scans**: Catch issues before merging
- **Avoid triggering on all branches**: Frequent pushes on feature branches lead to unnecessary scans

### 11.2 Configure Exclusion Rules Properly

Exclude files that don't need scanning in `sonar-project.properties`:

```properties
sonar.exclusions=**/*.test.*,**/*.spec.*,**/node_modules/**,**/dist/**,**/coverage/**,**/generated/**
sonar.coverage.exclusions=**/*.config.*,**/migrations/**
```

This reduces scanning noise and lets SonarQube focus on business code.

### 11.3 Continuous Improvement Over Perfection

- Quality Gate thresholds should be set **gradually** — don't set them too high initially
- Focus primarily on **Blocker** and **Critical** level issues
- Code smells and technical debt can be cleaned up incrementally — no need to fix everything at once
- Incorporate code quality improvements into your team's development workflow

### 11.4 Handling Scan Failures

**Case 1: Occasional false positives**

Some SonarQube rules may not be suitable for your project. You can handle this in the SonarQube Cloud dashboard:

1. Go to **Project → Administration → Analysis Scope → Issues**
2. Select the false positive issue and mark it as **Won't Fix** or **False Positive**

Alternatively, use inline comments to ignore specific rules:

```javascript
// The next line will skip the Sonar rule
// eslint-disable-some sonarjs/no-duplicate-string
const message = 'Hello World'
```

**Case 2: Genuine code quality issues**

The best approach is:

1. Review the issue list on the SonarQube Cloud dashboard or in the PR
2. Fix the issues one by one
3. After fixing, the code will be automatically re-scanned (by pushing a new commit or re-running the workflow)

### 11.5 Integrating Coverage Reports (Optional)

If your project has test coverage configured, you can integrate the coverage report with SonarQube:

```properties
sonar.javascript.lcov.reportPaths=coverage/lcov.info
```

And add a step to the workflow to generate the coverage report:

```yaml
- name: Run tests with coverage
  run: pnpm test -- --coverage
```

## 12. What You Get

After completing the full configuration, you gain the following capabilities:

1. **Scan on push**: Every `git push` automatically triggers a SonarQube analysis
2. **PR Quality Gate**: Automatic Quality Gate check — blocks merging if thresholds aren't met
3. **Inline issue annotations**: Issues are displayed directly in the PR code diff
4. **Historical trend tracking**: Monitor code quality changes over time on the SonarQube Cloud dashboard
5. **Security risk alerts**: Automatically discover security hotspots before they become problems
6. **Technical debt quantification**: Know exactly how much effort is needed to improve code quality

## 13. Conclusion

With the configuration described in this article, we have integrated enterprise-grade code scanning into open source projects for free:

1. **SonarQube Cloud** serves as the code quality analysis platform — zero cost, zero maintenance
2. **GitHub Actions** automatically triggers scans without manual intervention
3. **Quality Gate** intercepts quality issues at the PR stage, ensuring the main branch stays clean
4. **Detailed analysis reports** help teams continuously improve code quality

This approach works not only for Astro/JS/TS projects but also for projects in **Java, Python, Go, C#, Kotlin, Ruby**, and more. Simply adjust the relevant settings in `sonar-project.properties` for quick adaptation.

Code quality isn't achieved overnight, but with the automation power of SonarQube Cloud and GitHub Actions, keeping your code healthy has never been easier.

## Reference Documentation

- [SonarQube Cloud Official Site](https://sonarcloud.io/)
- [SonarQube Cloud Documentation](https://docs.sonarsource.com/sonarcloud/)
- [SonarQube Scan Action (GitHub Marketplace)](https://github.com/marketplace/actions/official-sonarqube-scan)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [SonarQube Analysis Parameters](https://docs.sonarsource.com/sonarcloud/advanced-setup/analysis-parameters/)
- [Quality Gates Configuration Guide](https://docs.sonarsource.com/sonarcloud/quality-gates/)
