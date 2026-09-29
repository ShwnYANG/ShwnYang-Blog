<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, page } = useData()
const appId = import.meta.env.VALINE_APP_ID || import.meta.env.VITE_VALINE_APP_ID
const appKey = import.meta.env.VALINE_APP_KEY || import.meta.env.VITE_VALINE_APP_KEY
const enabled = Boolean(appId && appKey)
const loaded = ref(false)
const isArticle = frontmatter.value.article !== false && !frontmatter.value.home && page.value.relativePath !== 'index.md'

onMounted(() => {
  if (!enabled || !isArticle || document.getElementById('valine-script')) return
  const script = document.createElement('script')
  script.id = 'valine-script'
  script.src = 'https://unpkg.com/valine@1.5.1/dist/Valine.min.js'
  script.onload = () => {
    // @ts-expect-error Valine is provided by the CDN script.
    new window.Valine({
      el: '#valine-comment',
      appId,
      appKey,
      path: window.location.pathname,
      placeholder: '欢迎留下你的想法。',
      avatar: 'monsterid',
      meta: ['nick', 'mail'],
      requiredFields: ['nick'],
      pageSize: 10,
      visitor: true,
      avatar_cdn: 'https://cravatar.cn/avatar/'
    })
    loaded.value = true
  }
  document.head.appendChild(script)
})
</script>

<template>
  <section v-if="isArticle" class="comment-section">
    <div class="comment-heading"><span class="kicker">DISCUSSION</span><h2>评论区</h2><p>欢迎分享你的思考、补充或问题。</p></div>
    <div v-if="enabled" id="valine-comment" class="valine-box"></div>
    <div v-else class="comment-placeholder">评论服务尚未配置。请在 Vercel 环境变量中设置 <code>VALINE_APP_ID</code> 和 <code>VALINE_APP_KEY</code>。</div>
  </section>
</template>

<style scoped>
.comment-section { margin-top: 48px; padding-top: 28px; border-top: 1px solid var(--vp-c-divider); }
.comment-heading { margin-bottom: 18px; }.kicker { color: var(--vp-c-brand-1); font:600 11px var(--vp-font-family-mono); letter-spacing:.08em; }.comment-heading h2 { margin:5px 0 4px; font-size:22px; }.comment-heading p { margin:0; color:var(--vp-c-text-2); font-size:13px; }
.valine-box { min-height: 160px; }.comment-placeholder { padding:16px; border:1px dashed var(--vp-c-divider); color:var(--vp-c-text-2); font-size:13px; background:var(--vp-c-bg-soft); }
</style>
