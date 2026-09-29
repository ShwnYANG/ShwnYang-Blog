import fs from 'node:fs'
import path from 'node:path'
import glob from 'fast-glob'
import matter from 'gray-matter'
import { siteConfig } from './site.config'

const directoryAliases: Record<string, string> = {
  java: '01.后端开发', ml: '02.机器学习', crypto: '03.密码学', cmd: '04.命令手册', android: '06.Android开发'
}

export function getSectionSourceDir(id: string) {
  const dirs = fs.readdirSync('docs', { withFileTypes: true }).filter(entry => entry.isDirectory() && /^\d+\./.test(entry.name)).map(entry => entry.name)
  const normalizedId = id.toLowerCase().replace(/开发|手册/g, '')
  return directoryAliases[id] || dirs.find(dir => dir.toLowerCase().replace(/^\d+\./, '').replace(/开发|手册/g, '').startsWith(normalizedId)) || ''
}

export function getSectionIndexFiles() {
  return glob.sync('docs/00.目录页/*.md').reduce<Record<string, string>>((result, file) => {
    const { content } = matter(fs.readFileSync(file, 'utf8'))
    const id = content.match(/<Catalogue\s+track=["']([^"']+)["']/)?.[1]
    if (id && siteConfig.sections.some(section => section.id === id)) result[id] = file
    return result
  }, {})
}
