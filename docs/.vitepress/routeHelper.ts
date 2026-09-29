import fs from 'node:fs'
import path from 'node:path'
import glob from 'fast-glob'
import matter from 'gray-matter'
import { siteConfig } from './site.config'
import { getSectionIndexFiles, getSectionSourceDir } from './sectionDiscovery'

export interface SidebarItem {
  text: string
  link?: string
  collapsed?: boolean
  items?: SidebarItem[]
}

function cleanTitle(str: string): string {
  // Remove numeric prefixes like "01." or "999."
  return str.replace(/^\d+\./, '').trim()
}

export function getRewrites(): Record<string, string> {
  const rewrites: Record<string, string> = {
    ...Object.fromEntries(siteConfig.sections.map(section => {
      const file = getSectionIndexFiles()[section.id]
      return file ? [path.relative('docs', file), `${section.link.replace(/^\//, '').replace(/\/$/, '')}/index.md`] : []
    }).filter(item => item.length)),
    '05.更多/01.关于.md': 'about/index.md',
    '05.更多/02.友情链接.md': 'friends/index.md',
    '@pages/archivesPage.md': 'archives/index.md',
    '@pages/categoriesPage.md': 'categories/index.md',
    '@pages/tagsPage.md': 'tags/index.md',
  }

  const files = glob.sync('docs/**/*.md', {
    ignore: ['**/node_modules/**', '**/.vitepress/**', '**/public/**']
  })

  for (const file of files) {
    const rel = path.relative('docs', file)
    if (rewrites[rel] || rel === 'index.md') continue

    const content = fs.readFileSync(file, 'utf8')
    const { data } = matter(content)
    let permalink = data.permalink
    if (permalink) {
      permalink = permalink.replace(/^\//, '').replace(/\/$/, '')
      if (permalink) {
        rewrites[rel] = permalink + '.md'
      }
    }
  }

  return rewrites
}

function buildSidebarForDir(dirPath: string): SidebarItem[] {
  const fullPath = path.join('docs', dirPath)
  if (!fs.existsSync(fullPath)) return []

  const entries = fs.readdirSync(fullPath, { withFileTypes: true })
  entries.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))

  const items: SidebarItem[] = []
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    const itemFullPath = path.join(fullPath, entry.name)

    if (entry.isDirectory()) {
      const children = buildSidebarForDir(path.join(dirPath, entry.name))
      if (children.length > 0) {
        items.push({
          text: cleanTitle(entry.name),
          collapsed: false,
          items: children
        })
      }
    } else if (entry.name.endsWith('.md')) {
      const content = fs.readFileSync(itemFullPath, 'utf8')
      const { data } = matter(content)
      const title = data.title || cleanTitle(entry.name.replace(/\.md$/, ''))
      let link = data.permalink || ''
      if (link) {
        link = link.replace(/\/$/, '')
      } else {
        link = '/' + path.relative('docs', itemFullPath).replace(/\.md$/, '')
      }
      items.push({
        text: title,
        link
      })
    }
  }
  return items
}

function collectArticleLinks(items: SidebarItem[]): string[] {
  const links: string[] = []
  for (const item of items) {
    if (item.link) links.push(item.link)
    if (item.items) {
      links.push(...collectArticleLinks(item.items))
    }
  }
  return links
}

export function getSidebar(): Record<string, SidebarItem[]> {
  const sidebars = siteConfig.sections.map(section => ({ section, items: buildSidebarForDir(getSectionSourceDir(section.id)) }))
  const sidebar: Record<string, SidebarItem[]> = Object.fromEntries(sidebars.map(({ section, items }) => [section.link, items]))

  // Associate every article permalink with its track's sidebar
  for (const { items } of sidebars) {
    for (const link of collectArticleLinks(items)) sidebar[link] = items
  }

  return sidebar
}
