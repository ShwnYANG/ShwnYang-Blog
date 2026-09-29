<script setup lang="ts">
import { data as postsData } from '../../data/posts.data'
import { siteConfig } from '../../site.config'
</script>

<template>
  <section class="site-info" aria-label="站点信息">
    <div class="profile">
      <img :src="siteConfig.author.avatar" :alt="`${siteConfig.author.name} 的头像`" class="avatar" />
      <div>
        <div class="eyebrow">{{ siteConfig.site.eyebrow }}</div>
        <h1>{{ siteConfig.site.headline }}</h1>
        <p>{{ siteConfig.site.summary }}</p>
        <div class="links">
          <a :href="siteConfig.links.github" target="_blank" rel="noopener">GitHub</a>
          <a :href="`mailto:${siteConfig.links.email}`">联系我</a>
          <a :href="siteConfig.links.about">关于本站</a>
        </div>
      </div>
    </div>
    <div class="stats" aria-label="站点统计">
      <div><strong>{{ postsData.stats.totalPosts }}</strong><span>篇文章</span></div>
      <div><strong>{{ postsData.stats.totalCategories }}</strong><span>个分类</span></div>
      <div><strong>{{ Math.round(postsData.stats.totalWords / 1000) }}k+</strong><span>字数沉淀</span></div>
    </div>
  </section>
</template>

<style scoped>
.site-info { max-width: 1200px; margin: 0 auto; padding: 34px 24px 18px; display: flex; justify-content: space-between; gap: 32px; align-items: center; border-bottom: 1px solid var(--vp-c-divider); }
.profile { display: flex; align-items: center; gap: 18px; min-width: 0; }
.avatar { width: 68px; height: 68px; border-radius: 16px; object-fit: cover; border: 1px solid var(--vp-c-divider); }
.eyebrow { color: var(--vp-c-brand-1); font: 600 11px/1.4 var(--vp-font-family-mono); letter-spacing: .08em; }
h1 { margin: 5px 0 5px; font-size: 25px; line-height: 1.2; letter-spacing: 0; }
p { margin: 0; color: var(--vp-c-text-2); font-size: 14px; }
.links { display: flex; gap: 14px; margin-top: 10px; font-size: 13px; }
.links a { color: var(--vp-c-text-2); text-decoration: none; }
.links a:hover { color: var(--vp-c-brand-1); }
.stats { display: flex; gap: 26px; flex: 0 0 auto; }
.stats div { display: grid; gap: 3px; text-align: right; }
.stats strong { font-size: 22px; color: var(--vp-c-text-1); }
.stats span { color: var(--vp-c-text-3); font-size: 12px; }
@media (max-width: 700px) { .site-info { align-items: flex-start; flex-direction: column; } .stats { width: 100%; justify-content: space-between; } .stats div { text-align: left; } }
</style>
