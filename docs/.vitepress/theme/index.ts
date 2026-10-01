import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'
import { onMounted } from 'vue'

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

import './styles/custom.css'

let sitePv = ''
let siteUv = ''

function cacheOfficialCounters() {
  const pv = document.getElementById('busuanzi_value_site_pv')?.textContent?.trim()
  const uv = document.getElementById('busuanzi_value_site_uv')?.textContent?.trim()
  if (pv && pv !== '加载中') sitePv = pv
  if (uv && uv !== '加载中') siteUv = uv
}

function restoreOfficialCounters() {
  if (sitePv) {
    const element = document.getElementById('busuanzi_value_site_pv')
    if (element) element.textContent = sitePv
  }
  if (siteUv) {
    const element = document.getElementById('busuanzi_value_site_uv')
    if (element) element.textContent = siteUv
  }
}

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'layout-top': () => h(ReadingProgress),
      'layout-bottom': () => h(BackToTop),
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
    router.onAfterRouteChange = () => {
      // VitePress replaces the counter nodes during SPA navigation. Reuse the
      // values populated by the official Busuanzi script; do not issue another request.
      if (typeof window !== 'undefined') {
        window.setTimeout(restoreOfficialCounters, 0)
        window.setTimeout(restoreOfficialCounters, 100)
      }
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
      cacheOfficialCounters()
      const observer = new MutationObserver(cacheOfficialCounters)
      observer.observe(document.body, { childList: true, subtree: true, characterData: true })
    })
  }
} satisfies Theme
