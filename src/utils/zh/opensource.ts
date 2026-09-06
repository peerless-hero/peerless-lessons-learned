/*
 * @Author: peerless_hero peerless_hero@outlook.com
 * @Description: 开源贡献页数据（中文版）。数据快照：2026-08-28，
 * 检索方式为 `gh search prs --author peerless-hero --merged` 与 GitHub GraphQL
 * `user.pullRequests(states: MERGED)` 分页交叉验证，结果一致（29 条，覆盖全部历史）。
 * star 数为采集时点快照，npm 下载量为最近 7 天数据。
 */

export interface ContributionPR {
  number: number
  title: string
  url: string
  /** 合并日期（YYYY-MM-DD，UTC） */
  mergedAt: string
  scale: string
}

export interface ContributionItem {
  repo: string
  repoUrl: string
  stars: string
  language: string
  /** npm 下载量，仅部分包存在 */
  downloads?: string
  summary: string
  prs: ContributionPR[]
  highlights: string[]
}

const GH = 'https://github.com'

export const openSourceMeta = {
  account: 'peerless-hero',
  accountUrl: `${GH}/peerless-hero`,
  collectedAt: '2026-08-28',
}

export const overviewStats = [
  { value: '29', label: '已合并 PR 总数（GitHub 状态为 MERGED）' },
  { value: '11', label: '外部公开仓库，纳入评估' },
  { value: '7', label: '推荐重点呈现，分布于 5 个仓库' },
  { value: '18', label: '自有私有仓库 PR，已按规则排除' },
]

/**
 * 全部已合并贡献，按最近合并时间倒序排列。
 * 条目含多个 PR 时，以其最近一次合并时间参与排序。
 */
export const contributions: ContributionItem[] = [
  {
    repo: 'TencentCloud/CubeSandbox',
    repoUrl: `${GH}/TencentCloud/CubeSandbox`,
    stars: '11,375',
    language: 'Go',
    summary: '为腾讯云沙箱产品交付 LangChain 集成指南（对应 issue #244），并附可直接运行的示例工程。',
    prs: [
      {
        number: 952,
        title: 'docs(integrations): add LangChain integration guide',
        url: `${GH}/TencentCloud/CubeSandbox/pull/952`,
        mergedAt: '2026-08-11',
        scale: '+1751/−0 · 18 文件',
      },
    ],
    highlights: [
      '中英双语集成指南各约 500 行，同时适配 LangChain 0.x 与 1.x；示例工程含 Dockerfile、依赖清单与样例数据集，共 18 个文件、新增 1751 行。',
    ],
  },
  {
    repo: 'lobehub/lobehub',
    repoUrl: `${GH}/lobehub/lobehub`,
    stars: '82,058',
    language: 'TypeScript',
    summary:
      '为 lobehub（Next.js AI 对话应用）新增 NEXT_PUBLIC_ASSET_PREFIX 环境变量，接入 Next.js assetPrefix 以支持静态资源 CDN 分发；并修复该能力引入的 Web Worker 跨域加载失败问题。',
    prs: [
      {
        number: 9624,
        title: 'fix: fix the Worker URL cross-origin issue',
        url: `${GH}/lobehub/lobehub/pull/9624`,
        mergedAt: '2025-10-14',
        scale: '+17/−1 · 1 文件',
      },
      {
        number: 9427,
        title: 'chore(config): add assetPrefix to nextConfig for environment variable support',
        url: `${GH}/lobehub/lobehub/pull/9427`,
        mergedAt: '2025-09-25',
        scale: '+15/−0 · 3 文件',
      },
    ],
    highlights: [
      '#9427：接入 NEXT_PUBLIC_ASSET_PREFIX，并同步补充中英文自部署环境变量文档。',
      '#9624：在 webpack 层将 *worker.ts 以 asset/resource + generator.publicPath 输出为同源路径，修复 CDN 部署下 Worker 跨域加载失败，覆盖 PGlite、Python Interpreter、Tokenizer 三处实例化。',
    ],
  },
  {
    repo: 'ruoyi-tdesign/ruoyi-tdesign',
    repoUrl: `${GH}/ruoyi-tdesign/ruoyi-tdesign`,
    stars: '111',
    language: 'Java',
    summary: '修复 ruoyi-tdesign 在服务器启用 IPv6 后内网地址判断异常导致的访问失败。',
    prs: [
      {
        number: 85,
        title: 'fix: 解决 ipv6 访问时判断内网地址导致的错误',
        url: `${GH}/ruoyi-tdesign/ruoyi-tdesign/pull/85`,
        mergedAt: '2025-01-24',
        scale: '+36/−5 · 1 文件',
      },
    ],
    highlights: [
      '根因：hutool NetUtil 的内网判断仅支持 IPv4，传入 IPv6 地址会抛异常。',
      '实现 isIPv6InnerIP，按首字节识别 ULA 私有段（fc00::/7、fd00::/8），对非法地址返回 false。',
    ],
  },
  {
    repo: 'uni-helper/uni-network',
    repoUrl: `${GH}/uni-helper/uni-network`,
    stars: '127',
    language: 'TypeScript',
    summary:
      '重构 uni-helper/uni-network 的错误处理链路，使 4xx/5xx 响应正确 reject 而非误入 success 回调；以破坏性变更（feat!）被合并。',
    prs: [
      {
        number: 56,
        title: 'feat!: improve error handling',
        url: `${GH}/uni-helper/uni-network/pull/56`,
        mergedAt: '2025-01-06',
        scale: '+70/−59 · 3 文件',
      },
    ],
    highlights: [
      '引入统一 UnError 错误模型，按 errMsg 分派类型化错误码，语义对齐 axios。',
      '消除 success/fail/complete 回调间共享的可变 response 状态，并修复网络异常时全局响应拦截器拿不到请求配置的问题。',
    ],
  },
  {
    repo: 'antfu/antfu.me',
    repoUrl: `${GH}/antfu/antfu.me`,
    stars: '1,067',
    language: 'TypeScript',
    summary: '为 antfu.me 的 Netlify 配置添加响应头，对 /assets/ 静态资源设置 1 年浏览器与 CDN 缓存。',
    prs: [
      {
        number: 97,
        title: 'feat(netlify): Implement caching for static assets',
        url: `${GH}/antfu/antfu.me/pull/97`,
        mergedAt: '2024-12-24',
        scale: '+5/−0 · 1 文件',
      },
    ],
    highlights: [],
  },
  {
    repo: 'ZhongxuYang/vite-plugin-version-mark',
    repoUrl: `${GH}/ZhongxuYang/vite-plugin-version-mark`,
    stars: '91',
    language: 'TypeScript',
    downloads: '3,175次/周',
    summary: '为 vite-plugin-version-mark 实现 outputFile 特性，在构建期输出携带版本号的静态文件，供前端轮询检测生产版本更新。',
    prs: [
      {
        number: 13,
        title: 'feat: new attributes outputFile',
        url: `${GH}/ZhongxuYang/vite-plugin-version-mark/pull/13`,
        mergedAt: '2024-10-19',
        scale: '+206/−19 · 9 文件 · 9 commits',
      },
    ],
    highlights: [
      '同时覆盖 Vite 插件与 Nuxt 3 Module 双入口，并补充单元测试、中英文档与 playground 示例。',
    ],
  },
  {
    repo: 'uni-helper/vite-plugin-uni-manifest',
    repoUrl: `${GH}/uni-helper/vite-plugin-uni-manifest`,
    stars: '32',
    language: 'TypeScript',
    summary: '依据 uni-app 官方文档补全 App 图标（app-plus.distribute.icons）的类型定义。',
    prs: [
      {
        number: 10,
        title: 'feat(types): add icons type for app-plus.distribute',
        url: `${GH}/uni-helper/vite-plugin-uni-manifest/pull/10`,
        mergedAt: '2023-08-29',
        scale: '+85/−1 · 2 文件',
      },
    ],
    highlights: [],
  },
  {
    repo: 'uni-helper/vite-plugin-uni-manifest',
    repoUrl: `${GH}/uni-helper/vite-plugin-uni-manifest`,
    stars: '32',
    language: 'TypeScript',
    summary: '补充 MpWeixin.es7 选项类型，修复 HBuilderX 自动上传微信平台报错。',
    prs: [
      {
        number: 9,
        title: 'chore(types): add es7 options for MpWeixin',
        url: `${GH}/uni-helper/vite-plugin-uni-manifest/pull/9`,
        mergedAt: '2023-08-29',
        scale: '+6/−0 · 1 文件',
      },
    ],
    highlights: [],
  },
  {
    repo: 'unplugin/unplugin-auto-import',
    repoUrl: `${GH}/unplugin/unplugin-auto-import`,
    stars: '3,792',
    language: 'TypeScript',
    downloads: '124.5万次/周',
    summary: '为 unplugin-auto-import 新增 injectAtEnd 配置项，控制自动导入语句的注入位置，解决其与手写 import 的顺序冲突。',
    prs: [
      {
        number: 327,
        title: 'feat(injectAtEnd): add new option',
        url: `${GH}/unplugin/unplugin-auto-import/pull/327`,
        mergedAt: '2023-03-23',
        scale: '+11/−1 · 2 文件',
      },
    ],
    highlights: [
      '将底层 unimport 的导入注入位置能力透出到插件配置层；默认值保持 true，存量用户行为不变。',
    ],
  },
  {
    repo: 'star7th/showdoc',
    repoUrl: `${GH}/star7th/showdoc`,
    stars: '12,855',
    language: 'PHP',
    summary: '修复 showdoc 附件上传至 S3/MinIO 后缺失响应头元信息的问题，使附件响应头正确。',
    prs: [
      {
        number: 1723,
        title: 'perf(CacheControl ContentType): 设置 s3 上传文件的字段，优化响应',
        url: `${GH}/star7th/showdoc/pull/1723`,
        mergedAt: '2022-06-09',
        scale: '+6/−1 · 1 文件',
      },
    ],
    highlights: [
      '在附件上传链路（AttachmentModel.class.php）补充 CacheControl 浏览器缓存控制头与正确的 Content-Type。',
    ],
  },
]
