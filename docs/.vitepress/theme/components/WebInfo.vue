<script setup lang="ts">
import { computed } from 'vue'
import { data as postsData } from '../../data/posts.data'
import { siteConfig } from '../../site.config'

const blogCreate = new Date(`${siteConfig.site.startDate}T00:00:00`)
const runningDays = computed(() => Math.max(0, Math.floor((Date.now() - blogCreate.getTime()) / 86400000)))
const latestDate = computed(() => postsData.posts.find(post => post.date)?.date || '')
const totalWords = computed(() => {
  const words = postsData.stats.totalWords
  return words >= 1000 ? `${(words / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(words)
})
</script>

<template>
  <section class="web-info" aria-label="站点信息">
    <div class="web-info-heading">
      <span class="web-info-kicker">{{ siteConfig.site.eyebrow }}</span>
      <h2>{{ siteConfig.site.headline }}</h2>
      <span class="web-info-mark" aria-hidden="true">✦</span>
    </div>
    <div class="web-info-updated">
      <span>运行 {{ runningDays || '&lt;1' }} 天</span>
      <span class="web-info-last-update">最后更新 <strong>{{ latestDate || '暂无' }}</strong></span>
    </div>
    <dl class="web-info-stats">
      <div><dt>文章</dt><dd>{{ postsData.stats.totalPosts }}<small>篇</small></dd></div>
      <div><dt>分类</dt><dd>{{ postsData.stats.totalCategories }}<small>个</small></dd></div>
      <div><dt>标签</dt><dd>{{ postsData.stats.totalTags }}<small>个</small></dd></div>
      <div><dt>字数</dt><dd>{{ totalWords }}</dd></div>
    </dl>
    <div class="web-info-visits">
      <span id="busuanzi_container_site_pv">本站访问 <strong id="busuanzi_value_site_pv">加载中</strong></span>
      <i aria-hidden="true"></i>
      <span id="busuanzi_container_site_uv">访客数 <strong id="busuanzi_value_site_uv">加载中</strong></span>
    </div>
  </section>
</template>

<style scoped>
.web-info { padding: 16px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-elv); }
.web-info-heading { position: relative; display: flex; align-items: baseline; justify-content: space-between; padding-bottom: 11px; border-bottom: 1px solid var(--vp-c-divider); }
.web-info-kicker { color: var(--vp-c-text-3); font: 600 9px/1 var(--vp-font-family-mono); letter-spacing: .16em; }
.web-info-heading h2 { margin: 0 0 0 auto; color: var(--vp-c-text-1); font-size: 15px; font-weight: 650; letter-spacing: .02em; }
.web-info-mark { margin-left: 8px; color: var(--vp-c-brand-1); font-size: 14px; }
.web-info-updated { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; padding: 12px 0 11px; }
.web-info-updated span { color: var(--vp-c-text-3); font-size: 11px; }
.web-info-last-update { display: inline-flex; align-items: baseline; gap: 5px; }
.web-info-updated strong { color: var(--vp-c-text-1); font: 600 14px/1.2 var(--vp-font-family-mono); letter-spacing: .02em; white-space: nowrap; }
.web-info-stats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); margin: 0; padding: 9px 0; border-top: 1px solid var(--vp-c-divider); border-bottom: 1px solid var(--vp-c-divider); }
.web-info-stats div { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; min-width: 0; padding: 6px 8px; border-left: 1px solid var(--vp-c-divider); }
.web-info-stats div:nth-child(odd) { padding-left: 0; border-left: 0; }
.web-info-stats dt { overflow: hidden; color: var(--vp-c-text-3); font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
.web-info-stats dd { margin: 0; color: var(--vp-c-text-1); font: 600 14px/1 var(--vp-font-family-mono); white-space: nowrap; }
.web-info-stats small { margin-left: 2px; color: var(--vp-c-text-3); font: 400 9px/1 var(--vp-font-family-base); }
.web-info-visits { position: relative; display: flex; align-items: center; gap: 10px; padding-top: 11px; color: var(--vp-c-text-3); font-size: 10px; }
.web-info-visits strong { color: var(--vp-c-text-2); font: 500 11px var(--vp-font-family-mono); }
.web-info-visits i { width: 3px; height: 3px; border-radius: 50%; background: var(--vp-c-brand-1); }
@media (max-width: 420px) { .web-info { padding: 14px; } .web-info-kicker { font-size: 8px; } .web-info-stats { grid-template-columns: 1fr; } .web-info-stats div, .web-info-stats div:nth-child(odd) { padding: 6px 0; border-left: 0; border-bottom: 1px solid var(--vp-c-divider); } .web-info-stats div:last-child { border-bottom: 0; } }
</style>
