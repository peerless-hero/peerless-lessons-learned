/*
 * Open source contributions page data (English). Data snapshot: 2026-08-28.
 * Retrieved via `gh search prs --author peerless-hero --merged` cross-checked with
 * GitHub GraphQL `user.pullRequests(states: MERGED)` — both return 29, covering all history.
 * Star counts are snapshot values; npm downloads are from the last 7 days.
 */

import type { ContributionItem } from '@utils/zh/opensource'

const GH = 'https://github.com'

export const openSourceMeta = {
  account: 'peerless-hero',
  accountUrl: `${GH}/peerless-hero`,
  collectedAt: '2026-08-28',
}

export const overviewStats = [
  { value: '29', label: 'Merged PRs total (GitHub state: MERGED)' },
  { value: '11', label: 'External public repos included' },
  { value: '7', label: 'Highlighted items across 5 repos' },
  { value: '18', label: 'PRs in private repos, excluded' },
]

/**
 * All merged contributions, sorted by most recent merge date (newest first).
 * Entries with multiple PRs are ordered by their latest merge date.
 */
export const contributions: ContributionItem[] = [
  {
    repo: 'TencentCloud/CubeSandbox',
    repoUrl: `${GH}/TencentCloud/CubeSandbox`,
    stars: '11,375',
    language: 'Go',
    summary: 'Delivered a LangChain integration guide for Tencent Cloud CubeSandbox (issue #244) with a runnable example project.',
    prs: [
      {
        number: 952,
        title: 'docs(integrations): add LangChain integration guide',
        url: `${GH}/TencentCloud/CubeSandbox/pull/952`,
        mergedAt: '2026-08-11',
        scale: '+1751/−0 · 18 files',
      },
    ],
    highlights: [
      'Bilingual guides of ~500 lines each, covering both LangChain 0.x and 1.x; the example project ships a Dockerfile, dependency manifests and a sample dataset — 18 files, +1,751 lines.',
    ],
  },
  {
    repo: 'lobehub/lobehub',
    repoUrl: `${GH}/lobehub/lobehub`,
    stars: '82,058',
    language: 'TypeScript',
    summary:
      'Added the NEXT_PUBLIC_ASSET_PREFIX environment variable to lobehub (a Next.js AI chat app) to enable CDN delivery of static assets via Next.js assetPrefix, and fixed the Web Worker cross-origin loading failure this introduced.',
    prs: [
      {
        number: 9624,
        title: 'fix: fix the Worker URL cross-origin issue',
        url: `${GH}/lobehub/lobehub/pull/9624`,
        mergedAt: '2025-10-14',
        scale: '+17/−1 · 1 file',
      },
      {
        number: 9427,
        title: 'chore(config): add assetPrefix to nextConfig for environment variable support',
        url: `${GH}/lobehub/lobehub/pull/9427`,
        mergedAt: '2025-09-25',
        scale: '+15/−0 · 3 files',
      },
    ],
    highlights: [
      '#9427: Wired the variable into Next.js assetPrefix and updated the EN/ZH self-hosting environment-variable docs.',
      '#9624: Forced *worker.ts to emit as a same-origin asset/resource via webpack generator.publicPath so Workers keep working under CDN deployments — covering PGlite, Python Interpreter and Tokenizer instantiation.',
    ],
  },
  {
    repo: 'ruoyi-tdesign/ruoyi-tdesign',
    repoUrl: `${GH}/ruoyi-tdesign/ruoyi-tdesign`,
    stars: '111',
    language: 'Java',
    summary: 'Fixed the access failure in ruoyi-tdesign caused by the intranet-IP check once IPv6 is enabled on the server.',
    prs: [
      {
        number: 85,
        title: 'fix: 解决 ipv6 访问时判断内网地址导致的错误',
        url: `${GH}/ruoyi-tdesign/ruoyi-tdesign/pull/85`,
        mergedAt: '2025-01-24',
        scale: '+36/−5 · 1 file',
      },
    ],
    highlights: [
      'Root cause: hutool NetUtil only supports IPv4 for the intranet check and throws on IPv6 addresses.',
      'Implemented isIPv6InnerIP, which detects ULA private ranges (fc00::/7, fd00::/8) by first byte and returns false for invalid addresses.',
    ],
  },
  {
    repo: 'uni-helper/uni-network',
    repoUrl: `${GH}/uni-helper/uni-network`,
    stars: '127',
    language: 'TypeScript',
    summary:
      'Refactored the error-handling pipeline of uni-helper/uni-network so 4xx/5xx responses reject properly instead of resolving through the success callback; accepted as a breaking change (feat!).',
    prs: [
      {
        number: 56,
        title: 'feat!: improve error handling',
        url: `${GH}/uni-helper/uni-network/pull/56`,
        mergedAt: '2025-01-06',
        scale: '+70/−59 · 3 files',
      },
    ],
    highlights: [
      'Introduced a unified UnError model that dispatches typed codes from errMsg, aligning semantics with axios.',
      'Removed the shared mutable response state across the success/fail/complete callbacks and fixed global interceptors losing the request config on network failures.',
    ],
  },
  {
    repo: 'antfu/antfu.me',
    repoUrl: `${GH}/antfu/antfu.me`,
    stars: '1,067',
    language: 'TypeScript',
    summary: 'Added response headers to the Netlify config of antfu.me, caching /assets/ static files for 1 year at both browser and CDN level.',
    prs: [
      {
        number: 97,
        title: 'feat(netlify): Implement caching for static assets',
        url: `${GH}/antfu/antfu.me/pull/97`,
        mergedAt: '2024-12-24',
        scale: '+5/−0 · 1 file',
      },
    ],
    highlights: [],
  },
  {
    repo: 'ZhongxuYang/vite-plugin-version-mark',
    repoUrl: `${GH}/ZhongxuYang/vite-plugin-version-mark`,
    stars: '91',
    language: 'TypeScript',
    downloads: '3,175/week',
    summary:
      'Implemented the outputFile feature for vite-plugin-version-mark, emitting a static file carrying the version at build time so front-ends can poll it to detect production releases.',
    prs: [
      {
        number: 13,
        title: 'feat: new attributes outputFile',
        url: `${GH}/ZhongxuYang/vite-plugin-version-mark/pull/13`,
        mergedAt: '2024-10-19',
        scale: '+206/−19 · 9 files · 9 commits',
      },
    ],
    highlights: [
      'Covers both the Vite plugin and the Nuxt 3 module entry points, with unit tests, bilingual docs and playground examples.',
    ],
  },
  {
    repo: 'uni-helper/vite-plugin-uni-manifest',
    repoUrl: `${GH}/uni-helper/vite-plugin-uni-manifest`,
    stars: '32',
    language: 'TypeScript',
    summary: 'Added type definitions for the App icon config (app-plus.distribute.icons) based on the official uni-app documentation.',
    prs: [
      {
        number: 10,
        title: 'feat(types): add icons type for app-plus.distribute',
        url: `${GH}/uni-helper/vite-plugin-uni-manifest/pull/10`,
        mergedAt: '2023-08-29',
        scale: '+85/−1 · 2 files',
      },
    ],
    highlights: [],
  },
  {
    repo: 'uni-helper/vite-plugin-uni-manifest',
    repoUrl: `${GH}/uni-helper/vite-plugin-uni-manifest`,
    stars: '32',
    language: 'TypeScript',
    summary: 'Added the MpWeixin.es7 option type, fixing HBuilderX failing to auto-upload to the WeChat platform.',
    prs: [
      {
        number: 9,
        title: 'chore(types): add es7 options for MpWeixin',
        url: `${GH}/uni-helper/vite-plugin-uni-manifest/pull/9`,
        mergedAt: '2023-08-29',
        scale: '+6/−0 · 1 file',
      },
    ],
    highlights: [],
  },
  {
    repo: 'unplugin/unplugin-auto-import',
    repoUrl: `${GH}/unplugin/unplugin-auto-import`,
    stars: '3,792',
    language: 'TypeScript',
    downloads: '1.245M/week',
    summary:
      'Added the injectAtEnd option to unplugin-auto-import to control where auto-imported statements are injected, resolving ordering conflicts with hand-written imports.',
    prs: [
      {
        number: 327,
        title: 'feat(injectAtEnd): add new option',
        url: `${GH}/unplugin/unplugin-auto-import/pull/327`,
        mergedAt: '2023-03-23',
        scale: '+11/−1 · 2 files',
      },
    ],
    highlights: [
      'Exposed the injection-position capability of unimport at the plugin config layer; the default stays true so existing behavior is unchanged.',
    ],
  },
  {
    repo: 'star7th/showdoc',
    repoUrl: `${GH}/star7th/showdoc`,
    stars: '12,855',
    language: 'PHP',
    summary: 'Fixed missing response-header metadata for attachments uploaded to S3/MinIO in showdoc.',
    prs: [
      {
        number: 1723,
        title: 'perf(CacheControl ContentType): 设置 s3 上传文件的字段，优化响应',
        url: `${GH}/star7th/showdoc/pull/1723`,
        mergedAt: '2022-06-09',
        scale: '+6/−1 · 1 file',
      },
    ],
    highlights: [
      'Added a CacheControl header and a correct Content-Type in the attachment upload path (AttachmentModel.class.php).',
    ],
  },
]
