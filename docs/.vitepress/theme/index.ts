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

declare global {
  interface Window {
    [key: string]: unknown
  }
}

let busuanziRequestId = 0

function refreshBusuanzi(attempt = 0) {
  const hasCounter = document.getElementById('busuanzi_value_site_pv')
    || document.getElementById('busuanzi_value_site_uv')
    || document.getElementById('busuanzi_value_page_pv')
  if (!hasCounter) {
    if (attempt < 10) window.setTimeout(() => refreshBusuanzi(attempt + 1), 50)
    return
  }

  const callbackName = `__busuanziCallback${++busuanziRequestId}`
  const script = document.createElement('script')
  const callback = (data: Record<string, string | number>) => {
    const values: Record<string, string | number> = {
      site_pv: data.site_pv,
      site_uv: data.site_uv,
      page_pv: data.page_pv
    }
    Object.entries(values).forEach(([key, value]) => {
      const element = document.getElementById(`busuanzi_value_${key}`)
      if (element && value !== undefined) element.textContent = String(value)
    })
    cleanup()
  }
  const cleanup = () => {
    delete window[callbackName]
    script.remove()
  }

  window[callbackName] = callback
  script.src = `https://counter.busuanzi.icodeq.com/?jsonpCallback=${callbackName}`
  script.onerror = cleanup
  document.head.appendChild(script)
  window.setTimeout(cleanup, 10000)
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
      // VitePress replaces the page DOM after navigation; wait until the new
      // counter nodes exist before requesting the values.
      if (typeof window !== 'undefined') window.setTimeout(() => refreshBusuanzi(), 0)
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
      // The script in <head> handles the initial page in most browsers, but
      // explicitly fetch here so the counters also work after hydration.
      window.setTimeout(() => refreshBusuanzi(), 0)
    })
  }
} satisfies Theme
