import { defineConfig } from 'vitepress'
import { getRewrites, getSidebar } from './routeHelper'
import { siteConfig } from './site.config'

export default defineConfig({
  title: siteConfig.title,
  description: siteConfig.description,
  lang: 'zh-CN',
  base: '/',
  cleanUrls: true,
  ignoreDeadLinks: true,

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
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css'
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
    lineNumbers: true,
    math: true
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
