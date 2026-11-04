import { h, nextTick, onMounted } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'
import { inject, pageview } from '@vercel/analytics'

import HomeBento from './components/HomeBento.vue'
import HomeRecent from './components/HomeRecent.vue'
import ArticleMeta from './components/ArticleMeta.vue'
import Catalogue from './components/Catalogue.vue'
import Archives from './components/Archives.vue'
import Categories from './components/Categories.vue'
import Tags from './components/Tags.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import SiteInfo from './components/SiteInfo.vue'
import HomePinned from './components/HomePinned.vue'
import CommentSection from './components/CommentSection.vue'
import HomeLayout from './components/HomeLayout.vue'
import PageInfo from './components/PageInfo.vue'
import WebInfo from './components/WebInfo.vue'
import BackToTop from './components/BackToTop.vue'
import MiniPet from './components/MiniPet.vue'
import SiteMotion from './components/SiteMotion.vue'
import ArticleSidebarToggle from './components/ArticleSidebarToggle.vue'
import MermaidDiagram from './components/MermaidDiagram.vue'

import './styles/custom.css'

let sitePv = ''
let siteUv = ''
const pagePv = new Map<string, string>()
const fetchedAt = new Map<string, number>()
const pendingPaths = new Set<string>()
let requestId = 0
let lastTrackedPath = ''
let analyticsInitialized = false

type VisitCounts = {
  site: { pageviews: number; visitors: number }
  page: { pageviews: number; visitors: number }
}

function showCount(id: string, value: string) {
  const element = document.getElementById(id)
  if (element) element.textContent = value
}

function showCachedCounts(path: string) {
  if (sitePv) showCount('vercel_site_pv', sitePv)
  if (siteUv) showCount('vercel_site_uv', siteUv)
  const cachedPagePv = pagePv.get(path)
  showCount('vercel_page_pv', cachedPagePv || '加载中')
}

async function loadVisitCounts(path: string) {
  if (pendingPaths.has(path) || Date.now() - (fetchedAt.get(path) || 0) < 60000) return
  pendingPaths.add(path)
  const currentRequestId = ++requestId
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 10000)

  try {
    const response = await fetch(`/api/visit-counts?path=${encodeURIComponent(path)}`, { signal: controller.signal })
    if (!response.ok) throw new Error(`Visit counts returned ${response.status}`)
    const counts = await response.json() as VisitCounts
    sitePv = String(counts.site.pageviews)
    siteUv = String(counts.site.visitors)
    pagePv.set(path, String(counts.page.pageviews))
    if (counts.site.pageviews > 0 && counts.page.pageviews > 0) fetchedAt.set(path, Date.now())
    else fetchedAt.delete(path)
    if (window.location.pathname === path && currentRequestId === requestId) showCachedCounts(path)
  } catch {
    if (window.location.pathname !== path || currentRequestId !== requestId) return
    if (!sitePv) showCount('vercel_site_pv', '--')
    if (!siteUv) showCount('vercel_site_uv', '--')
    if (!pagePv.has(path)) showCount('vercel_page_pv', '--')
  } finally {
    pendingPaths.delete(path)
    window.clearTimeout(timeout)
  }
}

function trackPageview(path: string) {
  if (!analyticsInitialized || lastTrackedPath === path) return
  lastTrackedPath = path
  pageview({ path })
}

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'layout-top': () => h(ReadingProgress),
      'layout-bottom': () => [h(BackToTop), h(MiniPet), h(SiteMotion), h(ArticleSidebarToggle)],
      'doc-before': () => h(PageInfo),
      'doc-after': () => h(CommentSection)
    })
  },
  enhanceApp({ app, router }) {
    app.component('MermaidDiagram', MermaidDiagram)
    app.component('HomeBento', HomeBento)
    app.component('HomeRecent', HomeRecent)
    app.component('ArticleMeta', ArticleMeta)
    app.component('Catalogue', Catalogue)
    app.component('Archives', Archives)
    app.component('Categories', Categories)
    app.component('Tags', Tags)
    app.component('ReadingProgress', ReadingProgress)
    app.component('SiteInfo', SiteInfo)
    app.component('HomePinned', HomePinned)
    app.component('CommentSection', CommentSection)
    app.component('HomeLayout', HomeLayout)
    app.component('PageInfo', PageInfo)
    app.component('WebInfo', WebInfo)
    router.onAfterRouteChange = async () => {
      if (typeof window === 'undefined') return
      await nextTick()
      const path = window.location.pathname
      trackPageview(path)
      showCachedCounts(path)
      loadVisitCounts(path)
    }
  },
  setup() {
    const initZoom = () => {
      mediumZoom('.vp-doc img:not(.no-zoom)', {
        background: 'rgba(0, 0, 0, 0.75)'
      })
    }
    onMounted(() => {
      initZoom()
      if (!analyticsInitialized) {
        inject({ disableAutoTrack: true })
        analyticsInitialized = true
      }
      const path = window.location.pathname
      trackPageview(path)
      showCachedCounts(path)
      loadVisitCounts(path)
    })
  }
} satisfies Theme
