/*
 * @Author: peerless_hero peerless_hero@outlook.com
 * @Date: 2024-09-07 03:45:19
 * @LastEditors: peerless_hero peerless_hero@outlook.com
 * @LastEditTime: 2026-07-23 00:25:58
 * @FilePath: \peerless-lessons-learned\astro.config.mjs
 * @Description:
 *
 */
import { env } from 'node:process'
import { unified } from '@astrojs/markdown-remark'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import unocss from '@unocss/astro'
import icon from 'astro-icon'
import pagefind from 'astro-pagefind'
import { defineConfig } from 'astro/config'
import { remarkModifiedTime } from './src/utils/remark-modified-time.mjs'

export default defineConfig({
  build: {
    assetsPrefix: env.ASSETS_PREFIX,
  },
  site: 'https://www.peerless.vip/',
  trailingSlash: 'always',
  vite: {
    ssr: {
      noExternal: ['astro-pagefind'],
    },
  },
  prefetch: {
    prefetchAll: true,
  },
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  image: {
    dangerouslyProcessSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkModifiedTime],
    }),
  },
  integrations: [
    sitemap(),
    mdx(),
    pagefind(),
    unocss({
      injectReset: true,
    }),
    icon({
      include: {
        'tabler': ['*'],
        'flagpack': ['*'],
        'flat-color-icons': ['*'],
        'octicon': ['mark-github-24'],
      },
    }),
  ],
})
