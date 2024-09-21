/*
 * @Author: peerless_hero peerless_hero@outlook.com
 * @Date: 2024-09-07 03:45:19
 * @LastEditors: peerless_hero peerless_hero@outlook.com
 * @LastEditTime: 2024-09-13 00:55:19
 * @FilePath: \peerless.vip\src\consts.ts
 * @Description:
 *
 */
interface LanguageConstants {
  SITE_TITLE: string
  SITE_DESCRIPTION: string
  TAGS_TITLE: string
  TAGS_DESCRIPTION: string
  SEARCH_PAGE_TITLE: string
  SEARCH_PAGE_DESCRIPTION: string
  GO_TO_HOMEPAGE: string
  ERROR_404_SUBMESSAGE: string
  ERROR_404_MESSAGE: string
  ERROR_404_DESCRIPTION: string
  ERROR_404_TITLE: string
  UPDATED_ON: string
  PUBLISHED_ON: string
  TAGS_HEADING: string
}

const zhConstants: LanguageConstants = {
  SITE_TITLE: '无双的经验之谈',
  SITE_DESCRIPTION:
    '无双的经验之谈 - 分享个人开发实践，传播前沿技术动态。',
  TAGS_TITLE: '无双的经验之谈 - 所有标签',
  TAGS_DESCRIPTION:
    '无双的经验之谈 - 分享个人开发实践，传播前沿技术动态。',
  SEARCH_PAGE_TITLE: '无双的经验之谈 - 站内搜索',
  SEARCH_PAGE_DESCRIPTION: '搜索无双的经验之谈全站内容',
  GO_TO_HOMEPAGE: '返回首页',
  ERROR_404_SUBMESSAGE: '您查找的页面不存在或已被移动。',
  ERROR_404_MESSAGE: '页面未找到',
  ERROR_404_DESCRIPTION: '404 - 页面未找到',
  ERROR_404_TITLE: '404 - 页面未找到',
  UPDATED_ON: '更新于',
  PUBLISHED_ON: '发布于',
  TAGS_HEADING: '标签',
}

const enConstants: LanguageConstants = {
  SITE_TITLE: 'peerlessLessonsLearned',
  SITE_DESCRIPTION:
    'peerlessLessonsLearned - Sharing Developer Insights & Frontline Tech Trends.',
  TAGS_TITLE: 'peerlessLessonsLearned - All Tags',
  TAGS_DESCRIPTION:
    'peerlessLessonsLearned - Sharing Developer Insights & Frontline Tech Trends.',
  SEARCH_PAGE_TITLE: 'peerlessLessonsLearned - Site Search',
  SEARCH_PAGE_DESCRIPTION: 'Search all content on peerlessLessonsLearned',
  GO_TO_HOMEPAGE: 'Go to Homepage',
  ERROR_404_SUBMESSAGE:
    'The page you\'re looking for doesn\'t exist or has been moved.',
  ERROR_404_MESSAGE: 'Page not found',
  ERROR_404_DESCRIPTION: '404 - Page not found',
  ERROR_404_TITLE: '404 - Page Not Found',
  UPDATED_ON: 'Updated on',
  PUBLISHED_ON: 'Published on',
  TAGS_HEADING: 'Tags',
}

export function getConstants(lang: 'zh' | 'en'): LanguageConstants {
  return lang === 'zh' ? zhConstants : enConstants
}

export function getTagMetadata(tag: string, lang: 'zh' | 'en') {
  if (lang === 'zh') {
    return {
      title: `无双的经验之谈中'${tag}'主题的所有文章`,
      description: `浏览无双的经验之谈关于${tag}的文章。`,
    }
  }
  else {
    return {
      title: `All articles on '${tag}' in peerlessLessonsLearned`,
      description: `Browse articles about ${tag} on peerlessLessonsLearned.`,
    }
  }
}

export function getCategoryMetadata(category: string, lang: 'zh' | 'en') {
  if (lang === 'zh') {
    return {
      title: `无双的经验之谈'${category}'相关的文章`,
      description: `在无双的经验之谈中浏览有关${category}主题的所有文章`,
    }
  }
  else {
    return {
      title: `Articles related to '${category}' on peerlessLessonsLearned`,
      description: `Browse all articles on ${category} in peerlessLessonsLearned`,
    }
  }
}
