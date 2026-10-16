<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { data as postsData } from '../../data/posts.data'
import { siteConfig } from '../../site.config'

const props = defineProps<{
  track?: string
}>()

const route = useRoute()

const currentTrack = computed(() => {
  if (props.track) return props.track
  const p = route.path
  if (p.includes('/java')) return 'java'
  if (p.includes('/android')) return 'android'
  if (p.includes('/ml')) return 'ml'
  if (p.includes('/crypto')) return 'crypto'
  if (p.includes('/cmd')) return 'cmd'
  return 'java'
})

const trackMeta = computed(() => {
  const section = siteConfig.sections.find(item => item.id === currentTrack.value)
  return section
    ? { title: section.title, desc: section.description, icon: section.icon, color: section.accent }
    : { title: '专栏目录', desc: '系统化技术知识专栏与文章索引。', icon: '/img/logo.png', color: '#3b82f6' }
})

const articles = computed(() => {
  return postsData.tracks[currentTrack.value] || []
})

const cleanDirectoryName = (name: string) => name.replace(/^\d+\./, '')
const compareSourceOrder = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true })

// Keep the section and every directory below it visible in the catalogue.
const sections = computed(() => {
  const groups = new Map<string, { name: string; directories: Map<string, typeof articles.value> }>()
  for (const a of articles.value) {
    const parts = a.rel.split('/')
    const sectionKey = parts.length > 2
      ? parts[1]
      : a.categories?.[a.categories.length - 1] || '精选技术'
    const sectionName = parts.length > 2 ? cleanDirectoryName(sectionKey) : sectionKey
    const directoryKey = parts.slice(2, -1).join('/')

    if (!groups.has(sectionKey)) {
      groups.set(sectionKey, { name: sectionName, directories: new Map() })
    }
    const directories = groups.get(sectionKey)!.directories
    if (!directories.has(directoryKey)) directories.set(directoryKey, [])
    directories.get(directoryKey)!.push(a)
  }

  return [...groups.entries()]
    .sort(([a], [b]) => compareSourceOrder(a, b))
    .map(([key, group]) => {
      const hasSubdirectories = [...group.directories.keys()].some(directory => directory)
      const directories = [...group.directories.entries()]
        .sort(([a], [b]) => !a ? -1 : !b ? 1 : compareSourceOrder(a, b))
        .map(([path, list]) => ({
          path,
          name: path ? path.split('/').map(cleanDirectoryName).join(' / ') : hasSubdirectories ? '本级文章' : '查看文章',
          articles: [...list].sort((a, b) => compareSourceOrder(a.rel, b.rel))
        }))

      return {
        key,
        name: group.name,
        count: directories.reduce((count, directory) => count + directory.articles.length, 0),
        hasSubdirectories,
        directories
      }
    })
})
</script>

<template>
  <div class="catalogue-wrapper">
    <!-- Header Banner -->
    <div class="catalogue-header" :style="{ '--track-color': trackMeta.color }">
      <div class="header-icon-box">
        <img :src="trackMeta.icon" :alt="trackMeta.title" class="track-img" />
      </div>
      <div class="header-text">
        <div class="header-badge">{{ articles.length }} 篇深度技术笔记</div>
        <h1 class="header-title">{{ trackMeta.title }}</h1>
        <p class="header-desc">{{ trackMeta.desc }}</p>
      </div>
    </div>

    <!-- Sections Grid -->
    <div class="sections-container">
      <div
        v-for="sec in sections"
        :key="sec.key"
        class="section-card"
      >
        <div class="section-card-header">
          <div class="section-card-title">
            <span class="sec-dot" :style="{ background: trackMeta.color }"></span>
            <h2>{{ sec.name }}</h2>
          </div>
          <span class="sec-count">{{ sec.count }} 篇</span>
        </div>

        <component :is="sec.hasSubdirectories ? 'details' : 'div'" v-for="directory in sec.directories" :key="directory.path" class="directory-group">
          <summary v-if="sec.hasSubdirectories" class="directory-heading">
            <h3>{{ directory.name }}</h3>
            <span>{{ directory.articles.length }} 篇</span>
            <svg class="directory-chevron" viewBox="0 0 20 20" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </summary>
          <div class="articles-list">
            <a
              v-for="art in directory.articles"
              :key="art.link"
              :href="art.link"
              class="article-item"
            >
              <div class="art-main">
                <span class="art-title">{{ art.title }} <span v-if="art.titleTag" class="catalogue-tag">{{ art.titleTag }}</span><span v-if="art.recommend" class="catalogue-tag recommend">推荐</span></span>
                <span v-if="art.date" class="art-date">{{ art.date }}</span>
              </div>
              <div class="art-meta">
                <span class="art-time">约 {{ art.readingTime }} 分钟</span>
                <svg class="art-arrow" viewBox="0 0 20 20" width="14" height="14" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </a>
          </div>
        </component>
      </div>
    </div>
  </div>
</template>

<style scoped>
.catalogue-wrapper {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 0 64px;
}

.catalogue-header {
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 24px 26px;
  border-radius: 12px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  margin-bottom: 22px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.header-icon-box {
  width: 76px;
  height: 76px;
  border-radius: 18px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  flex-shrink: 0;
}

.track-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.header-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 9999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  margin-bottom: 8px;
}

.header-title {
  font-size: 25px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--vp-c-text-1);
  margin: 0 0 10px 0;
  border: none;
  padding: 0;
}

.header-desc {
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0;
}

.sections-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-card {
  border-radius: 10px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  padding: 15px 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.02);
}

.section-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 12px;
}

.section-card-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sec-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.section-card-title h2 {
  font-size: 19px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0;
  border: none;
  padding: 0;
}

.sec-count {
  font-size: 12.5px;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
  padding: 3px 10px;
  border-radius: 9999px;
}

.directory-group + .directory-group {
  margin-top: 14px;
}

.directory-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 4px;
  padding: 8px 10px;
  border-left: 2px solid var(--vp-c-brand-1);
  border-radius: 0 6px 6px 0;
  cursor: pointer;
  list-style: none;
  transition: background-color .2s ease;
}

.directory-heading::-webkit-details-marker {
  display: none;
}

.directory-heading:hover,
.directory-heading:focus-visible {
  background: var(--vp-c-bg-soft);
}

.directory-heading:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.directory-heading h3 {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
  color: var(--vp-c-text-1);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.5;
}

.directory-heading span {
  flex-shrink: 0;
  color: var(--vp-c-text-3);
  font-size: 11px;
}

.directory-chevron {
  flex-shrink: 0;
  margin-left: auto;
  color: var(--vp-c-text-3);
  transition: transform .2s ease;
}

.directory-group[open] .directory-chevron {
  transform: rotate(180deg);
}

.directory-group[open] .articles-list {
  margin-top: 6px;
}

.articles-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 5px 10px;
}

.article-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 10px;
  border-radius: 6px;
  color: inherit !important;
  text-decoration: none !important;
  transition: all 0.2s ease;
}

.article-item:hover {
  background: var(--vp-c-bg-soft);
}

.art-main {
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex: 1;
}

.art-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  transition: color 0.2s ease;
}

.catalogue-tag { display: inline-block; margin-left: 4px; padding: 1px 5px; border-radius: 3px; background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); font-size: 10px; font-weight: 600; vertical-align: 1px; }
.catalogue-tag.sticky { background: rgba(239, 68, 68, .12); color: #dc2626; }
.catalogue-tag.recommend { background: rgba(245, 158, 11, .14); color: #b45309; }

.article-item:hover .art-title {
  color: var(--vp-c-brand-1);
}

.art-date {
  font-size: 11px;
  color: var(--vp-c-text-3);
}

.art-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--vp-c-text-3);
}

.art-arrow {
  color: var(--vp-c-text-3);
  transition: transform 0.2s ease, color 0.2s ease;
}

.article-item:hover .art-arrow {
  color: var(--vp-c-brand-1);
  transform: translateX(3px);
}

@media (max-width: 768px) {
  .catalogue-header {
    flex-direction: column;
    text-align: center;
    gap: 16px;
    padding: 24px;
  }
  .header-icon-box {
    margin: 0 auto;
  }
  .art-main {
    flex-direction: column;
    gap: 2px;
  }
  .articles-list { grid-template-columns: 1fr; }
}
</style>
