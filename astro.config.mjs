/*
 * @Author: peerless_hero peerless_hero@outlook.com
 * @Date: 2024-09-07 03:45:19
 * @LastEditors: peerless_hero peerless_hero@outlook.com
 * @LastEditTime: 2025-01-18 23:34:17
 * @FilePath: \peerless-lessons-learned\astro.config.mjs
 * @Description:
 *
 */
import { env } from 'node:process'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
    ],
  },
  markdown: {
    remarkPlugins: [remarkModifiedTime],
  },
  integrations: [
    sitemap(),
    mdx(),
    pagefind(),
    tailwind(),
    icon({
      include: {
        'tabler': ['*'],
        'flagpack': ['*'],
        'flat-color-icons': ['*'],
      },
    }),
  ],
})
