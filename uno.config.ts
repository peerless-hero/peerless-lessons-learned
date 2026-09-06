import type { TypographyTheme } from '@unocss/preset-typography'
import type { PresetWind3Theme } from 'unocss'
import {
  defineConfig,
  presetTypography,
  presetWind3,
  transformerDirectives,
} from 'unocss'

// 显式指定 Theme 为 wind3 的 Theme（含 fontFamily 等字段），避免 presetTypography 的
// 泛型约束（Theme extends TypographyTheme）将 T 错误推断为仅含 colors 的 TypographyTheme，
// 从而导致 theme.fontFamily 报 "不在类型 TypographyTheme 中"。

/**
 * 创建 Preline 状态变体。将 hs-xxx:utility 转换为对应 CSS 选择器规则，
 * 替代手写 preflights。变体与 dark:/hover: 等内置变体自然链式组合。
 *
 * 注意：UnoCSS 变体通过 selector 函数接收当前(含变体前缀的)类选择器 s，
 * 直接在其前面拼祖先选择器即可，不能再使用旧的 "{cls}" 字符串模板，
 * 否则会生成重复前缀（如 hs-dark-mode-active:hs-dark-mode-active:hidden）。
 *
 * @param prefix    - 变体前缀，如 'hs-dropdown-open:'
 * @param ancestors - 祖先选择器前缀数组。以空格 / > 结尾表示命中其后代元素，
 *                    否则表示实用类所在元素本身同时满足该祖先条件。每个祖先
 *                    独立生成一条规则，保证与 dark:/hover: 等链式变体组合时
 *                    前缀（守卫）能正确作用于每一条。
 *
 * @example prelineState('hs-dropdown-open:', [
 *   '.hs-dropdown.open > ',                          // 直接子元素
 *   '.hs-dropdown.open > .hs-dropdown-toggle ',      // 后代元素
 *   '.hs-dropdown.open > .hs-dropdown-menu > ',      // 直接子元素
 *   '.hs-dropdown-menu.open',                        // 元素自身
 * ])
 * // safelist 中有 'hs-dropdown-open:opacity-100' 时自动生成:
 * // .hs-dropdown.open > .hs-dropdown-open\:opacity-100,
 * // .hs-dropdown.open > .hs-dropdown-toggle .hs-dropdown-open\:opacity-100,
 * // .hs-dropdown.open > .hs-dropdown-menu > .hs-dropdown-open\:opacity-100,
 * // .hs-dropdown-menu.open.hs-dropdown-open\:opacity-100 { opacity: 1 }
 */
function prelineState(prefix: string, ancestors: string[]) {
  return {
    match(matcher: string) {
      if (!matcher.startsWith(prefix))
        return
      const rest = matcher.slice(prefix.length)
      const handlers = ancestors.map(ancestor => ({
        matcher: rest,
        selector(s: string) {
          return `${ancestor}${s}`
        },
      }))
      return handlers.length === 1 ? handlers[0] : handlers
    },
  }
}
export default defineConfig<PresetWind3Theme & TypographyTheme>({
  presets: [
    presetWind3(),
    presetTypography(),
  ],
  transformers: [
    transformerDirectives(),
  ],
  shortcuts: [
    { 'icon-base': 'size-5 inline-block align-bottom' },
    { 'text-medium': 'font-medium' },
  ],
  rules: [
    // 自定义 backgroundImage 覆盖（来自原 tailwind.config.mjs 的 extend.backgroundImage）
    [
      'bg-gradient-to-t',
      {
        'background-image':
          'linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%)',
      },
    ],
    [
      'bg-transparent',
      {
        'background-image':
          'linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%)',
      },
    ],
  ],
  // safelist 仅保留 Preline JS 动态控制的 variant 类（无法被静态扫描器检测）
  safelist: [
    // Preline dropdown
    'hs-dropdown-open:opacity-100',
    'hs-dropdown-open:rotate-180',
    // Preline collapse
    'hs-collapse-open:block',
    'hs-collapse-open:hidden',
    // Preline tab
    'hs-tab-active:bg-white',
    'hs-tab-active:shadow-md',
    'hs-tab-active:hover:border-transparent',
    'hs-tab-active:text-neutral-600',
    // Preline tab (dark)
    'dark:hs-tab-active:bg-neutral-700',
    'dark:hs-tab-active:text-neutral-200',
    'dark:hs-tab-active:text-neutral-500',
    // Preline dark mode
    'hs-dark-mode-active:hidden',
    'hs-dark-mode-active:inline-flex',
    // Preline combo box selected
    'hs-combo-box-selected:block',
    // Preline file upload complete
    'hs-file-upload-complete:bg-green-600',
    // Preline data placement
    '[--placement:top-left]',
  ],
  // Preline 状态变体：将 hs-xxx:utility 转换为相应 CSS 选择器，
  // 替代手写 preflights。变体与 dark:/hover: 等内置变体自然链式组合。
  variants: [
    prelineState('hs-dropdown-open:', [
      '.hs-dropdown.open > ',
      '.hs-dropdown.open > .hs-dropdown-toggle ',
      '.hs-dropdown.open > .hs-dropdown-menu > ',
      '.hs-dropdown-menu.open',
    ]),
    prelineState('hs-collapse-open:', [
      '.hs-collapse.open ',
      '.hs-collapse.open',
      '.hs-collapse-toggle.open ',
      '.hs-collapse-toggle.open',
    ]),
    prelineState('hs-tab-active:', [
      '[data-hs-tab].active',
      '[data-hs-tab].active ',
    ]),
    prelineState('hs-dark-mode-active:', [
      '.dark ',
    ]),
    prelineState('hs-combo-box-selected:', [
      '.selected',
      '.selected ',
    ]),
    prelineState('hs-file-upload-complete:', [
      '.complete',
      '.complete ',
    ]),
  ],
  preflights: [
    {
      // dark:prose-invert 无法由 safelist + 变体处理（presetTypography 的 prose-invert
      // 不是标准 utility class），需手写 CSS 变量覆盖
      getCSS: () => `
.dark.prose-invert, .dark .prose-invert {
  --un-prose-body: #d4d4d4; --un-prose-headings: #fff; --un-prose-links: #fff;
  --un-prose-bold: #fff; --un-prose-counters: #a3a3a3; --un-prose-bullets: #a3a3a3;
  --un-prose-hr: #404040; --un-prose-quotes: #e5e5e5; --un-prose-quote-borders: #525252;
  --un-prose-captions: #a3a3a3; --un-prose-code: #e5e5e5; --un-prose-pre-bg: #171717;
  --un-prose-th-borders: #404040; --un-prose-td-borders: #262626;
}
`,
    },
  ],
  theme: {
    fontFamily: {
      sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Oxygen-Sans", Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif',
      serif: 'system-ui, -apple-system, BlinkMacSystemFont, Georgia, Cambria, "Times New Roman", serif',
      mono: 'system-ui, -apple-system, BlinkMacSystemFont, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
  },
})
