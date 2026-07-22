/*
 * @Author: peerless_hero peerless_hero@outlook.com
 * @Date: 2024-09-22 00:34:30
 * @LastEditors: peerless_hero peerless_hero@outlook.com
 * @LastEditTime: 2026-07-22 22:03:39
 * @FilePath: \peerless-lessons-learned\eslint.config.mjs
 * @Description: eslint配置文件
 *
 */
import antfu from '@antfu/eslint-config'

export default antfu({
  astro: true,
  formatters: true,
  unocss: true,
}, {
  rules: {
    'style/jsx-tag-spacing': 'off',
  },
})
