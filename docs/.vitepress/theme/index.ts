import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'

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

const BUSUANZI_SCRIPT_ID = 'busuanzi-script'
const BUSUANZI_SCRIPT_SRC = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
const BUSUANZI_IDS = ['busuanzi_value_site_pv', 'busuanzi_value_site_uv', 'busuanzi_value_page_pv']

declare global {
  interface Window {
    busuanzi?: { fetch?: () => void }
  }
}

function markBusuanziUnavailable() {
  BUSUANZI_IDS.forEach((id) => {
    const element = document.getElementById(id)
    if (element && element.textContent === '加载中') element.textContent = '暂不可用'
  })
}

function loadBusuanzi() {
  const existing = document.getElementById(BUSUANZI_SCRIPT_ID) as HTMLScriptElement | null
  if (existing) {
    window.busuanzi?.fetch?.()
    return
  }
  const script = document.createElement('script')
  script.id = BUSUANZI_SCRIPT_ID
  script.async = true
  script.src = BUSUANZI_SCRIPT_SRC
  script.onload = () => window.busuanzi?.fetch?.()
  script.onerror = markBusuanziUnavailable
  document.head.appendChild(script)
  window.setTimeout(() => {
    if (!window.busuanzi) markBusuanziUnavailable()
  }, 8000)
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
  },
  setup() {
    const route = useRoute()
    const initZoom = () => {
      mediumZoom('.vp-doc img:not(.no-zoom)', {
        background: 'rgba(0, 0, 0, 0.75)'
      })
    }
    onMounted(() => {
      initZoom()
      loadBusuanzi()
    })
    watch(
      () => route.path,
      () => nextTick(() => {
        initZoom()
        window.busuanzi?.fetch?.()
      })
    )
  }
} satisfies Theme
