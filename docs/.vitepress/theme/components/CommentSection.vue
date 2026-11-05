<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'

type ValineConstructor = new (options: Record<string, unknown>) => unknown

const { frontmatter, page } = useData()
const appId = import.meta.env.VALINE_APP_ID || import.meta.env.VITE_VALINE_APP_ID
const appKey = import.meta.env.VALINE_APP_KEY || import.meta.env.VITE_VALINE_APP_KEY
const enabled = Boolean(appId && appKey)
const isArticle = computed(() => frontmatter.value.article !== false && !frontmatter.value.home && page.value.relativePath !== 'index.md')
const commentElement = ref<HTMLElement | null>(null)
const loadState = ref<'loading' | 'ready' | 'error'>('loading')
let loadId = 0
let scriptPromise: Promise<void> | null = null

function getValine() {
  return (window as Window & { Valine?: ValineConstructor }).Valine
}

function loadScript(): Promise<void> {
  if (getValine()) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = '/vendor/valine/Valine.min.js'
    script.async = true

    const fail = () => {
      window.clearTimeout(timeout)
      script.remove()
      reject(new Error('Valine script failed to load'))
    }
    const timeout = window.setTimeout(fail, 12000)
    script.onload = () => {
      window.clearTimeout(timeout)
      if (getValine()) resolve()
      else fail()
    }
    script.onerror = fail
    document.head.appendChild(script)
  }).catch(error => {
    scriptPromise = null
    throw error
  })

  return scriptPromise
}

async function initComments() {
  if (!enabled || !isArticle.value || !commentElement.value) return
  const id = ++loadId
  const path = window.location.pathname
  loadState.value = 'loading'
  commentElement.value.replaceChildren()

  try {
    await loadScript()
    await nextTick()
    if (id !== loadId || path !== window.location.pathname || !isArticle.value || !commentElement.value) return

    const Valine = getValine()
    if (!Valine) throw new Error('Valine is unavailable')
    commentElement.value.replaceChildren()
    new Valine({
      el: commentElement.value,
      appId,
      appKey,
      path,
      placeholder: '欢迎留下你的想法。',
      avatar: 'monsterid',
      meta: ['nick', 'mail'],
      requiredFields: ['nick'],
      pageSize: 10,
      visitor: false,
      avatar_cdn: 'https://cravatar.cn/avatar/'
    })
    loadState.value = 'ready'
  } catch {
    if (id === loadId) loadState.value = 'error'
  }
}

onMounted(initComments)
watch(() => page.value.relativePath, async () => {
  ++loadId
  await nextTick()
  initComments()
}, { flush: 'post' })
</script>

<template>
  <section v-if="isArticle" class="comment-section">
    <div class="comment-heading"><span class="kicker">DISCUSSION</span><h2>评论区</h2><p>欢迎分享你的思考、补充或问题。</p></div>
    <template v-if="enabled">
      <p v-if="loadState === 'loading'" class="comment-status" role="status">评论加载中…</p>
      <div v-else-if="loadState === 'error'" class="comment-status" role="alert">
        评论暂时无法加载。<button type="button" @click="initComments">重试</button>
      </div>
      <div ref="commentElement" class="valine-box"></div>
    </template>
    <div v-else class="comment-placeholder">评论服务尚未配置。请在 Vercel 环境变量中设置 <code>VALINE_APP_ID</code> 和 <code>VALINE_APP_KEY</code>。</div>
  </section>
</template>

<style scoped>
.comment-section { margin-top: 48px; padding-top: 28px; border-top: 1px solid var(--vp-c-divider); }
.comment-heading { margin-bottom: 18px; }.kicker { color: var(--vp-c-brand-1); font:600 11px var(--vp-font-family-mono); letter-spacing:.08em; }.comment-heading h2 { margin:5px 0 4px; font-size:22px; }.comment-heading p { margin:0; color:var(--vp-c-text-2); font-size:13px; }
.valine-box:not(:empty) { min-height: 160px; }.comment-placeholder { padding:16px; border:1px dashed var(--vp-c-divider); color:var(--vp-c-text-2); font-size:13px; background:var(--vp-c-bg-soft); }
.comment-status { margin: 0; color: var(--vp-c-text-3); font-size: 13px; }
.comment-status button { padding: 0; border: 0; background: none; color: var(--vp-c-brand-1); font: inherit; cursor: pointer; }
.comment-status button:hover { text-decoration: underline; }
</style>
