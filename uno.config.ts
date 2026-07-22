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
 * @param prefix  - 变体前缀，如 'hs-dropdown-open:'
 * @param selectors - 选择器模板数组，{cls} 会被替换为实际 class 名
 *
 * @example prelineState('hs-dropdown-open:', [
 *   '.hs-dropdown.open > .hs-dropdown-open\\:{cls}',
 *   '.hs-dropdown.open > .hs-dropdown-toggle .hs-dropdown-open\\:{cls}',
 * ])
 * // safelist 中有 'hs-dropdown-open:opacity-100' 时自动生成:
 * // .hs-dropdown.open > .hs-dropdown-open\:opacity-100 { opacity: 1 }
 * // .hs-dropdown.open > .hs-dropdown-toggle .hs-dropdown-open\:opacity-100 { opacity: 1 }
 */
function prelineState(prefix: string, selectors: string[]) {
  return {
    match(matcher: string) {
      if (!matcher.startsWith(prefix))
        return
      return {
        matcher: matcher.slice(prefix.length),
        selector(s: string) {
          const cls = s.slice(1)
          return selectors.map(sel => sel.replace('{cls}', cls)).join(',')
        },
      }
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
      String.raw`.hs-dropdown.open > .hs-dropdown-open\:{cls}`,
      String.raw`.hs-dropdown.open > .hs-dropdown-toggle .hs-dropdown-open\:{cls}`,
      String.raw`.hs-dropdown.open > .hs-dropdown-menu > .hs-dropdown-open\:{cls}`,
      String.raw`.hs-dropdown-menu.open.hs-dropdown-open\:{cls}`,
    ]),
    prelineState('hs-collapse-open:', [
      String.raw`.hs-collapse.open .hs-collapse-open\:{cls}`,
      String.raw`.hs-collapse.open.hs-collapse-open\:{cls}`,
      String.raw`.hs-collapse-toggle.open .hs-collapse-open\:{cls}`,
      String.raw`.hs-collapse-toggle.open.hs-collapse-open\:{cls}`,
    ]),
    prelineState('hs-tab-active:', [
      String.raw`[data-hs-tab].active.hs-tab-active\:{cls}`,
      String.raw`[data-hs-tab].active .hs-tab-active\:{cls}`,
    ]),
    prelineState('hs-dark-mode-active:', [
      String.raw`.dark .hs-dark-mode-active\:{cls}`,
    ]),
    prelineState('hs-combo-box-selected:', [
      String.raw`.selected.hs-combo-box-selected\:{cls}`,
      String.raw`.selected .hs-combo-box-selected\:{cls}`,
    ]),
    prelineState('hs-file-upload-complete:', [
      String.raw`.complete.hs-file-upload-complete\:{cls}`,
      String.raw`.complete .hs-file-upload-complete\:{cls}`,
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
