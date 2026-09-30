<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { data as postsData } from '../../data/posts.data'
import { siteConfig } from '../../site.config'

const { frontmatter, page } = useData()
const isArticle = computed(() => {
  const relativePath = page.value.relativePath || ''
  return Boolean(!frontmatter.value.home && frontmatter.value.layout !== 'home' && frontmatter.value.article !== false && relativePath !== 'index.md' && !relativePath.startsWith('00.目录页/') && !relativePath.startsWith('@pages/') && !relativePath.startsWith('05.更多/'))
})
const post = computed(() => {
  if (!isArticle.value) return undefined
  const permalink = String(frontmatter.value.permalink || '').replace(/\/$/, '')
  const relativePath = `/${page.value.relativePath || ''}`.replace(/\.md$/, '')
  return postsData.posts.find(item => (permalink && item.link.replace(/\/$/, '') === permalink) || item.link.replace(/\/$/, '') === relativePath)
})
const author = computed(() => {
  const value = frontmatter.value.author
  return typeof value === 'object' && value ? value.name : value || post.value?.author || siteConfig.author.name
})
const date = computed(() => post.value?.date || String(frontmatter.value.date || '').slice(0, 10))
const categories = computed(() => normalize(frontmatter.value.categories || post.value?.categories))
const tags = computed(() => normalize(frontmatter.value.tags || post.value?.tags))
function normalize(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter(Boolean).map(String)
  return value ? [String(value)] : []
}
</script>

<template>
  <section v-if="isArticle" class="page-info" aria-label="文章信息">
    <div class="page-info-main">
      <img :src="siteConfig.author.avatar" :alt="`${siteConfig.author.name} 的头像`" class="page-info-avatar" />
      <span class="page-info-author">{{ author }}</span>
      <span v-if="date" class="page-info-item">发布于 {{ date }}</span>
      <span v-if="post?.words" class="page-info-item">{{ post.words.toLocaleString() }} 字</span>
      <span v-if="post?.readingTime" class="page-info-item">阅读约 {{ post.readingTime }} 分钟</span>
      <span id="busuanzi_container_page_pv" class="page-info-item page-view-item"><span>浏览</span><span id="busuanzi_value_page_pv">加载中</span></span>
    </div>
    <div v-if="categories.length || tags.length" class="page-info-labels">
      <a v-for="item in categories" :key="`category-${item}`" :href="`/categories/?category=${encodeURIComponent(item)}`" class="category-label">{{ item }}</a>
      <a v-for="item in tags" :key="`tag-${item}`" :href="`/tags/?tag=${encodeURIComponent(item)}`" class="tag-label"># {{ item }}</a>
    </div>
  </section>
</template>

<style scoped>
.page-info { margin: 0 0 24px; padding-bottom: 16px; border-bottom: 1px solid var(--vp-c-divider); color: var(--vp-c-text-2); font-size: 13px; }
.page-info-main, .page-info-labels { display: flex; align-items: center; flex-wrap: wrap; gap: 10px 14px; }
.page-info-avatar { width: 24px; height: 24px; border-radius: 50%; object-fit: cover; }
.page-info-author { color: var(--vp-c-text-1); font-weight: 600; }
.page-info-item { white-space: nowrap; }
.page-view-item { display: inline-flex; gap: 4px; }
.page-info-labels { margin-top: 12px; gap: 6px; }
.page-info-labels a { padding: 2px 7px; border-radius: 4px; text-decoration: none; font-size: 12px; }
.category-label { background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); }
.tag-label { background: var(--vp-c-bg-soft); color: var(--vp-c-text-2); }
</style>
