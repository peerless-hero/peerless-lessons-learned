/*
 * @Author: peerless_hero peerless_hero@outlook.com
 * @Date: 2024-09-22 00:34:30
 * @LastEditors: peerless_hero peerless_hero@outlook.com
 * @LastEditTime: 2025-03-03 00:40:22
 * @FilePath: \peerless-lessons-learned\eslint.config.mjs
 * @Description: eslint配置文件
 *
 */
import antfu from '@antfu/eslint-config'

export default antfu({
  astro: true,
}, {
  rules: {
    'style/jsx-tag-spacing': 'off',
  },
})
