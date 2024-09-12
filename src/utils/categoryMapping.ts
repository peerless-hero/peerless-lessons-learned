/*
 * @Author: peerless_hero peerless_hero@outlook.com
 * @Date: 2024-09-07 03:45:19
 * @LastEditors: peerless_hero peerless_hero@outlook.com
 * @LastEditTime: 2024-09-13 01:38:11
 * @FilePath: \peerless.vip\src\utils\categoryMapping.ts
 * @Description: 
 * 
 */
export const categoryMapping: Record<string, string> = {
  软件开发教程: "DevGuide",
  技术前沿速递: "TechFront",
  个人生活杂谈: "ChatLife",
};

export const reverseCategoryMapping: Record<string, string> = Object.keys(
  categoryMapping,
).reduce((acc, key) => ({ ...acc, [categoryMapping[key]]: key }), {});

export function getEnglishCategory(chineseCategory: string): string {
  return categoryMapping[chineseCategory] || chineseCategory;
}

export function getChineseCategory(englishCategory: string): string {
  return reverseCategoryMapping[englishCategory] || englishCategory;
}
