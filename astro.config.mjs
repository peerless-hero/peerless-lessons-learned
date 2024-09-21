import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'
import icon from 'astro-icon'
import pagefind from 'astro-pagefind'
import { remarkModifiedTime } from './src/utils/remark-modified-time.mjs'

export default defineConfig({
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
