export const ARTICLE_URL = '/article'

export interface ArticleItem {
  id?: string
  parentId?: string
  index: string
  icon: string
  name: string
  tags?: string
  routeName: string
  routePath: string
  permission: string[]
}

interface ArticleData {
  title: string
  content: string
  tags?: string
}

export function publishArticles(data: ArticleData) {
  return request({
    url: ARTICLE_URL,
    method: 'post',
    data,
  })
}

export default generateRestfulApi(ARTICLE_URL)
