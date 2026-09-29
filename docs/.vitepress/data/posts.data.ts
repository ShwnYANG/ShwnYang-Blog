import fs from 'node:fs'
import path from 'node:path'
import glob from 'fast-glob'
import matter from 'gray-matter'
import { siteConfig } from '../site.config'
import { getSectionSourceDir } from '../sectionDiscovery'

export interface Post {
  title: string
  link: string
  date: string
  year: string
  month: string
  words: number
  readingTime: number
  categories: string[]
  tags: string[]
  author?: string
  excerpt?: string
  rel: string
  track: string
  sticky: number
  recommend: boolean
  titleTag?: string
}

export interface ArchiveYear {
  year: string
  count: number
  months: {
    month: string
    posts: Post[]
  }[]
}

export interface PostsData {
  posts: Post[]
  categories: { name: string; count: number; posts: Post[] }[]
  tags: { name: string; count: number; posts: Post[] }[]
  archives: ArchiveYear[]
  tracks: Record<string, Post[]>
  stats: {
    totalPosts: number
    totalWords: number
    totalCategories: number
    totalTags: number
  }
}

export default {
  watch: ['docs/**/*.md'],
  load(): PostsData {
    const files = glob.sync('docs/**/*.md', {
      ignore: ['**/node_modules/**', '**/.vitepress/**', '**/public/**']
    })

    const posts: Post[] = []
    const categoryMap: Record<string, Post[]> = {}
    const tagMap: Record<string, Post[]> = {}
    const tracks: Record<string, Post[]> = Object.fromEntries([
      ...siteConfig.sections.map(section => [section.id, [] as Post[]]),
      ['other', [] as Post[]]
    ])

    let totalWords = 0

    for (const file of files) {
      const rel = path.relative('docs', file)
      if (
        rel === 'index.md' ||
        rel.startsWith('00.目录页') ||
        rel.startsWith('@pages') ||
        rel === '05.更多/01.关于.md' ||
        rel === '05.更多/02.友情链接.md'
      ) {
        continue
      }

      const content = fs.readFileSync(file, 'utf8')
      const { data, content: body } = matter(content)
      if (data.article === false) continue

      const cleanBody = body.trim()
      const words = cleanBody.replace(/\s+/g, '').length
      totalWords += words
      const readingTime = Math.max(1, Math.round(words / 300))

      let link = data.permalink || ''
      if (link) {
        link = link.replace(/\/$/, '')
      } else {
        link = '/' + rel.replace(/\.md$/, '')
      }

      let dateStr = ''
      let year = '未知年份'
      let month = '未知'
      if (data.date) {
        const d = new Date(data.date)
        if (!isNaN(d.getTime())) {
          dateStr = d.toISOString().slice(0, 10)
          year = String(d.getFullYear())
          month = String(d.getMonth() + 1).padStart(2, '0')
        }
      }

      const rawCats = Array.isArray(data.categories) ? data.categories : (data.categories ? [data.categories] : [])
      const categories = rawCats.filter(Boolean)

      const rawTags = Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : [])
      const tags = rawTags.filter(Boolean)

      const section = siteConfig.sections.find(item => rel.startsWith(`${getSectionSourceDir(item.id)}/`))
      const track = section?.id || 'other'

      // Extract brief excerpt if not provided
      let excerpt = data.description || ''
      if (!excerpt && cleanBody) {
        const firstParagraph = cleanBody
          .split('\n')
          .filter(line => line.trim() && !line.startsWith('#') && !line.startsWith('!'))[0]
        if (firstParagraph) {
          excerpt = firstParagraph.slice(0, 120) + (firstParagraph.length > 120 ? '...' : '')
        }
      }

      const post: Post = {
        title: data.title || path.basename(file, '.md').replace(/^\d+\./, ''),
        link,
        date: dateStr,
        year,
        month,
        words,
        readingTime,
        categories,
        tags,
        author: data.author?.name || siteConfig.author.name,
        excerpt,
        rel,
        track,
        sticky: data.sticky === true ? 1 : (typeof data.sticky === 'number' ? data.sticky : 0),
        recommend: data.recommend === true || data.recommend === 1 || data.recommended === true || data.recommended === 1,
        titleTag: typeof data.titleTag === 'string' ? data.titleTag : undefined
      }

      posts.push(post)
      if (tracks[track]) {
        tracks[track].push(post)
      }

      for (const cat of categories) {
        if (!categoryMap[cat]) categoryMap[cat] = []
        categoryMap[cat].push(post)
      }

      for (const tag of tags) {
        if (!tagMap[tag]) tagMap[tag] = []
        tagMap[tag].push(post)
      }
    }

    // Sort posts by date descending
    posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''))

    // Sort categories by count descending
    const categoriesList = Object.entries(categoryMap)
      .map(([name, catPosts]) => ({
        name,
        count: catPosts.length,
        posts: catPosts.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      }))
      .sort((a, b) => b.count - a.count)

    // Sort tags by count descending
    const tagsList = Object.entries(tagMap)
      .map(([name, tagPosts]) => ({
        name,
        count: tagPosts.length,
        posts: tagPosts.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      }))
      .sort((a, b) => b.count - a.count)

    // Build archives
    const yearGroups: Record<string, Record<string, Post[]>> = {}
    for (const post of posts) {
      const y = post.year || '其他'
      const m = post.month || '00'
      if (!yearGroups[y]) yearGroups[y] = {}
      if (!yearGroups[y][m]) yearGroups[y][m] = []
      yearGroups[y][m].push(post)
    }

    const archives: ArchiveYear[] = Object.keys(yearGroups)
      .sort((a, b) => b.localeCompare(a))
      .map(year => {
        const monthsObj = yearGroups[year]
        let yearCount = 0
        const months = Object.keys(monthsObj)
          .sort((a, b) => b.localeCompare(a))
          .map(month => {
            const mPosts = monthsObj[month]
            yearCount += mPosts.length
            return {
              month,
              posts: mPosts
            }
          })
        return {
          year,
          count: yearCount,
          months
        }
      })

    return {
      posts,
      categories: categoriesList,
      tags: tagsList,
      archives,
      tracks,
      stats: {
        totalPosts: posts.length,
        totalWords,
        totalCategories: categoriesList.length,
        totalTags: tagsList.length
      }
    }
  }
}
