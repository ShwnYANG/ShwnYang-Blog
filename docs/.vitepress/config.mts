import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { defineConfig } from 'vitepress'
import { getRewrites, getSidebar } from './routeHelper'
import { siteConfig } from './site.config'

const isArticlePath = (filePath: string) => /^\d+\./.test(filePath) && !/^(?:00|05)\./.test(filePath)

export default defineConfig({
  title: siteConfig.title,
  description: siteConfig.description,
  lang: 'zh-CN',
  base: '/',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,
  sitemap: { hostname: siteConfig.url },

  transformPageData(pageData, { siteConfig: config }) {
    if (pageData.isNotFound || pageData.frontmatter.description || !isArticlePath(pageData.filePath)) return

    const source = path.join(config.srcDir, pageData.filePath)
    if (!fs.existsSync(source)) return
    const { content } = matter(fs.readFileSync(source, 'utf8'))
    const paragraph = content
      .replace(/```[\s\S]*?```/g, '')
      .split(/\n\s*\n/)
      .map(block => block.replace(/\n/g, ' ').trim())
      .find(block => block && !/^(?:#|>|-|\*|!|<|\d+\.)/.test(block))
    if (!paragraph) return

    const description = paragraph
      .replace(/!?\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[`*_~]/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 155)
    if (description) return { description }
  },

  transformHead({ page, pageData, title, description }) {
    if (pageData.isNotFound || page === '404.md') return
    const route = page.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
    const canonical = new URL(route || '/', `${siteConfig.url}/`).href
    const isArticle = isArticlePath(pageData.filePath)
    const date = pageData.frontmatter.date

    return [
      ['link', { rel: 'canonical', href: canonical }],
      ['meta', { property: 'og:type', content: isArticle ? 'article' : 'website' }],
      ['meta', { property: 'og:site_name', content: siteConfig.title }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: canonical }],
      ...(isArticle && date ? [['meta', { property: 'article:published_time', content: String(date).slice(0, 10) }]] as const : [])
    ]
  },

  head: [
    ['link', { rel: 'icon', href: '/img/favicon.ico' }],
    ['meta', { name: 'author', content: siteConfig.author.name }],
    [
      'meta',
      {
        name: 'keywords',
        content: '个人技术博客,后端开发,Java,SpringCloud,SpringBoot,Android开发,机器学习,联邦学习,密码学,同态加密,隐私计算'
      }
    ],
    ['meta', { name: 'theme-color', content: '#3b82f6' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com'
      }
    ],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: ''
      }
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap'
      }
    ]
  ],

  rewrites: getRewrites(),

  vite: {
    // Allow Valine variables without requiring a VITE_ prefix.
    envPrefix: ['VITE_', 'VALINE_'],
    define: {
      'import.meta.env.VALINE_APP_ID': JSON.stringify(process.env.VALINE_APP_ID || process.env.VITE_VALINE_APP_ID || ''),
      'import.meta.env.VALINE_APP_KEY': JSON.stringify(process.env.VALINE_APP_KEY || process.env.VITE_VALINE_APP_KEY || '')
    }
  },

  markdown: {
    config(md) {
      const fence = md.renderer.rules.fence!
      md.renderer.rules.fence = (tokens, index, options, env, self) => {
        const token = tokens[index]
        if (token.info.trim() === 'mermaid') {
          return `<MermaidDiagram source="${md.utils.escapeHtml(encodeURIComponent(token.content))}" />\n`
        }
        return fence(tokens, index, options, env, self)
      }
    },
    lineNumbers: true,
    math: true,
    languageAlias: {
      mysql: 'sql',
      dos: 'bat'
    }
  },

  themeConfig: {
    logo: '/img/logo.png',
    siteTitle: siteConfig.title,

    nav: [
      { text: '首页', link: '/' },
      ...siteConfig.sections.map(section => ({ text: section.navTitle, link: section.link })),
      { text: '关于', link: '/about/' },
      {
        text: '索引',
        items: [
          { text: '时间线归档', link: '/archives/' },
          { text: '分类导引', link: '/categories/' },
          { text: '标签墙', link: '/tags/' }
        ]
      }
    ],

    sidebar: getSidebar(),

    outline: {
      level: [2, 3],
      label: '本页大纲'
    },

    socialLinks: [
      { icon: 'github', link: siteConfig.links.github }
    ],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档 (⌘K)',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    },

    footer: {
      message: '基于 VitePress 搭建 · 聚焦技术深度与极致体验',
      copyright: `Copyright © 2023-PRESENT ${siteConfig.author.name} | MIT Licensed`
    }
  }
})
