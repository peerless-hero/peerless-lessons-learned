export const tagMapping: Record<string, string> = {
  Docker: 'first',
  甲戌: 'second',
  甲午: 'third',
  AI: 'AI',
  乙丑: 'fifth',
  乙卯: 'sixth',
  丙寅: 'seventh',
  丙子: 'eighth',
  丙辰: 'ninth',
}

export const reverseTagMapping: Record<string, string> = {}
Object.keys(tagMapping).forEach((k) => {
  reverseTagMapping[tagMapping[k]] = k
})

export function getEnglishTag(chineseTag: string): string {
  return tagMapping[chineseTag] || chineseTag
}

export function getChineseTag(englishTag: string): string {
  return reverseTagMapping[englishTag] || englishTag
}
