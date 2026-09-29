<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { siteConfig } from '../../site.config'

const { frontmatter, page } = useData()

const isArticle = computed(() => {
  if (frontmatter.value.home || frontmatter.value.layout === 'home') return false
  if (frontmatter.value.article === false) return false
  if (page.value.relativePath === 'index.md') return false
  if (page.value.relativePath.includes('00.目录页')) return false
  if (page.value.relativePath.includes('@pages')) return false
  if (page.value.relativePath.includes('05.更多/01.关于')) return false
  return true
})

const author = computed(() => {
  return frontmatter.value.author?.name || frontmatter.value.author || siteConfig.author.name
})

const dateStr = computed(() => {
  if (!frontmatter.value.date) return ''
  const d = new Date(frontmatter.value.date)
  if (isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
})

const categories = computed(() => {
  const cats = frontmatter.value.categories
  if (!cats) return []
  return Array.isArray(cats) ? cats.filter(Boolean) : [cats]
})

const tags = computed(() => {
  const t = frontmatter.value.tags
  if (!t) return []
  return Array.isArray(t) ? t.filter(Boolean) : [t]
})
</script>

<template>
  <div v-if="isArticle" class="article-meta-banner">
    <div class="meta-row">
      <div class="author-info">
        <img :src="siteConfig.author.avatar" :alt="`${siteConfig.author.name} 的头像`" class="author-avatar" />
        <span class="author-name">{{ author }}</span>
      </div>

      <div class="meta-details">
        <span v-if="dateStr" class="meta-item">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {{ dateStr }}
        </span>

        <span class="meta-item">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          原创笔记
        </span>
      </div>
    </div>

    <!-- Category & Tags badges -->
    <div v-if="categories.length || tags.length" class="meta-badges">
      <span v-for="cat in categories" :key="cat" class="cat-badge">
        📁 {{ cat }}
      </span>
      <span v-for="tag in tags" :key="tag" class="tag-badge">
        # {{ tag }}
      </span>
    </div>

    <div class="meta-divider"></div>
  </div>
</template>

<style scoped>
.article-meta-banner {
  margin-bottom: 24px;
}

.meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--vp-c-divider);
}

.author-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.meta-details {
  display: flex;
  align-items: center;
  gap: 14px;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: var(--vp-c-text-3);
}

.meta-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.cat-badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 6px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

.tag-badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}

.meta-divider {
  height: 1px;
  background: var(--vp-c-divider);
  margin-top: 12px;
}
</style>
