/*
 * @Author: peerless_hero peerless_hero@outlook.com
 * @Date: 2024-09-07 03:45:19
 * @LastEditors: peerless_hero peerless_hero@outlook.com
 * @LastEditTime: 2024-09-22 00:21:46
 * @FilePath: \peerless-lessons-learned\src\content\config.ts
 * @Description:
 *
 */
import { defineCollection, z } from 'astro:content'

const globs = import.meta.glob<string>('../assets/*', { eager: true, import: 'default' })

const posts = defineCollection({
  type: 'content',
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
