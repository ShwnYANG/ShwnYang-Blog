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

import './styles/custom.css'

let sitePv = ''
let siteUv = ''
const pagePv = new Map<string, string>()
let lastRequestedPath = ''
let requestId = 0

type VisitCounts = { site_pv?: number; site_uv?: number; page_pv?: number }

function showCount(id: string, value: string) {
  const element = document.getElementById(id)
  if (element) element.textContent = value
}

function showCachedCounts(path: string) {
  if (sitePv) showCount('busuanzi_value_site_pv', sitePv)
  if (siteUv) showCount('busuanzi_value_site_uv', siteUv)
  const cachedPagePv = pagePv.get(path)
  if (cachedPagePv) showCount('busuanzi_value_page_pv', cachedPagePv)
}

function loadVisitCounts(path: string) {
  if (lastRequestedPath === path) return
  lastRequestedPath = path
  const currentRequestId = ++requestId
  const callbackName = `BusuanziCallback_${Date.now()}_${currentRequestId}`
  const callbacks = window as unknown as Record<string, ((counts: VisitCounts) => void) | undefined>
  const script = document.createElement('script')
  let settled = false

  const cleanup = () => {
    if (settled) return false
    settled = true
    window.clearTimeout(timeout)
    script.remove()
    delete callbacks[callbackName]
    return true
  }

  callbacks[callbackName] = (counts) => {
    if (!cleanup()) return
    if (Number.isFinite(counts.site_pv)) sitePv = String(counts.site_pv)
    if (Number.isFinite(counts.site_uv)) siteUv = String(counts.site_uv)
    if (Number.isFinite(counts.page_pv)) pagePv.set(path, String(counts.page_pv))
    if (window.location.pathname === path && currentRequestId === requestId) showCachedCounts(path)
  }

  const fail = () => {
    if (!cleanup() || window.location.pathname !== path || currentRequestId !== requestId) return
    if (!sitePv) showCount('busuanzi_value_site_pv', '--')
    if (!siteUv) showCount('busuanzi_value_site_uv', '--')
    if (!pagePv.has(path)) showCount('busuanzi_value_page_pv', '--')
  }
  const timeout = window.setTimeout(fail, 10000)
  script.onerror = fail
  script.referrerPolicy = 'no-referrer-when-downgrade'
  script.src = `https://busuanzi.ibruce.info/busuanzi?jsonpCallback=${callbackName}`
  document.head.appendChild(script)
}

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'layout-top': () => h(ReadingProgress),
      'layout-bottom': () => [h(BackToTop), h(MiniPet), h(SiteMotion)],
      'doc-before': () => h(PageInfo),
      'doc-after': () => h(CommentSection)
    })
  },
  enhanceApp({ app, router }) {
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
