<script setup lang="ts">
import { computed } from 'vue'
import { data as postsData } from '../../data/posts.data'
import { siteConfig } from '../../site.config'

const recentPosts = computed(() => {
  return postsData.posts.slice(0, 8)
})

function getTrackBadge(track: string) {
  const section = siteConfig.sections.find(item => item.id === track)
  return section
    ? { label: section.navTitle, color: section.accent, bg: `color-mix(in srgb, ${section.accent} 10%, transparent)` }
    : { label: '技术随笔', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' }
}
</script>

<template>
  <section class="recent-section">
    <div class="section-header">
      <div>
        <h2 class="section-title">最新沉淀笔记</h2>
        <p class="section-desc">持续更新的高质量实战记录与技术洞察</p>
      </div>
      <a href="/archives/" class="more-link">
        <span>查看全部 {{ postsData.stats.totalPosts }} 篇归档</span>
        <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </a>
    </div>

    <div class="posts-list">
      <a
        v-for="post in recentPosts"
        :key="post.link"
        :href="post.link"
        class="post-card"
      >
        <div class="post-meta">
          <span
            class="track-pill"
            :style="{
              color: getTrackBadge(post.track).color,
              background: getTrackBadge(post.track).bg
            }"
          >
            {{ getTrackBadge(post.track).label }}
          </span>
          <span class="post-date">{{ post.date }}</span>
          <span class="meta-dot">·</span>
          <span class="reading-time">约 {{ post.readingTime }} 分钟阅读</span>
        </div>

        <h3 class="post-title">{{ post.title }}</h3>
        <p v-if="post.excerpt" class="post-excerpt">{{ post.excerpt }}</p>

        <div class="post-tags" v-if="post.categories.length || post.tags.length">
          <span
            v-for="cat in post.categories.slice(0, 3)"
            :key="cat"
            class="tag-item"
          >
            # {{ cat }}
          </span>
        </div>
      </a>
    </div>

    <div class="recent-footer">
      <a href="/archives/" class="btn-all-posts">
        <span>探索完整技术时间线 ({{ postsData.stats.totalPosts }} 篇)</span>
        <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </a>
    </div>
  </section>
</template>

<style scoped>
.recent-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px 64px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 28px;
}

.section-title {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--vp-c-text-1);
  margin: 0 0 6px 0;
  border: none;
  padding: 0;
}

.section-desc {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin: 0;
}

.more-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: gap 0.2s ease;
}

.more-link:hover {
  gap: 8px;
}

.posts-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.post-card {
  display: flex;
  flex-direction: column;
  padding: 22px;
  border-radius: 14px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  text-decoration: none !important;
  color: inherit !important;
  transition: all 0.25s ease;
}

.post-card:hover {
  transform: translateY(-3px);
  border-color: var(--vp-c-brand-soft);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: var(--vp-c-text-3);
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.track-pill {
  font-size: 11.5px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
}

.meta-dot {
  opacity: 0.5;
}

.post-title {
  font-size: 17px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--vp-c-text-1);
  margin: 0 0 8px 0;
  border: none;
  padding: 0;
  transition: color 0.2s ease;
}

.post-card:hover .post-title {
  color: var(--vp-c-brand-1);
}

.post-excerpt {
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0 0 14px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.post-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag-item {
  font-size: 12px;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
  padding: 2px 6px;
  border-radius: 4px;
}

.recent-footer {
  margin-top: 36px;
  text-align: center;
}

.btn-all-posts {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1) !important;
  font-weight: 500;
  font-size: 14.5px;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-all-posts:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

@media (max-width: 768px) {
  .posts-list {
    grid-template-columns: 1fr;
  }
}
</style>
