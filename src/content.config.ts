/*
 * @Author: peerless_hero peerless_hero@outlook.com
 * @Date: 2026-07-23 00:06:18
 * @LastEditors: peerless_hero peerless_hero@outlook.com
 * @LastEditTime: 2026-07-23 00:14:24
 * @FilePath: \peerless-lessons-learned\src\content.config.ts
 * @Description: 内容配置
 */
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { defineCollection } from 'astro:content'

const globs = import.meta.glob<string>('./assets/*', { eager: true, import: 'default' })

const posts = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
    lastModified: z.string().optional(),
    cover: z.string().transform(arg => globs[arg] || arg),
    coverAlt: z.string(),
    category: z.array(z.string()),
    tags: z.array(z.string()),
    author: z.string(),
  }),
})

export const collections = { posts }
