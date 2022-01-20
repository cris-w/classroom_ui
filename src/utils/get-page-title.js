import defaultSettings from '@/settings'

const title = defaultSettings.title || '翻转课堂'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
