import { h, nextTick, onMounted } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'

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
let lastRequestedPath = ''
let requestId = 0

type VisitCounts = {
  busuanzi_site_pv?: number | string
  busuanzi_site_uv?: number | string
  busuanzi_page_pv?: number | string
}

function showCount(id: string, value: string) {
  const element = document.getElementById(id)
  if (element) element.textContent = value
}

function showCachedCounts(path: string) {
  if (sitePv) showCount('busuanzi_site_pv', sitePv)
  if (siteUv) showCount('busuanzi_site_uv', siteUv)
  const cachedPagePv = pagePv.get(path)
  if (cachedPagePv) showCount('busuanzi_page_pv', cachedPagePv)
}

async function loadVisitCounts(path: string) {
  if (lastRequestedPath === path) return
  lastRequestedPath = path
  const currentRequestId = ++requestId
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 10000)

  try {
    const response = await fetch('https://cdn.busuanzi.cc/api.php', {
      method: 'POST',
      body: JSON.stringify({ url: window.location.href, referrer: document.referrer }),
      signal: controller.signal
    })
    if (!response.ok) throw new Error(`Busuanzi returned ${response.status}`)
    const counts = await response.json() as VisitCounts
    if (counts.busuanzi_site_pv != null) sitePv = String(counts.busuanzi_site_pv)
    if (counts.busuanzi_site_uv != null) siteUv = String(counts.busuanzi_site_uv)
    if (counts.busuanzi_page_pv != null) pagePv.set(path, String(counts.busuanzi_page_pv))
    if (window.location.pathname === path && currentRequestId === requestId) showCachedCounts(path)
  } catch {
    if (window.location.pathname !== path || currentRequestId !== requestId) return
    if (!sitePv) showCount('busuanzi_site_pv', '--')
    if (!siteUv) showCount('busuanzi_site_uv', '--')
    if (!pagePv.has(path)) showCount('busuanzi_page_pv', '--')
  } finally {
    window.clearTimeout(timeout)
  }
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
      const path = window.location.pathname
      showCachedCounts(path)
      loadVisitCounts(path)
    })
  }
} satisfies Theme
