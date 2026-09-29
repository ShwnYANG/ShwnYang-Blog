<script setup lang="ts">
import { data as postsData } from '../../data/posts.data'

const archives = postsData.archives
const stats = postsData.stats
</script>

<template>
  <div class="archives-wrapper">
    <div class="archives-header">
      <h1 class="archives-title">时间线归档</h1>
      <p class="archives-desc">
        共沉淀了 <span class="highlight">{{ stats.totalPosts }}</span> 篇原创技术笔记，记录学习与演进的每一步。
      </p>
    </div>

    <div class="timeline-container">
      <div v-for="yearGroup in archives" :key="yearGroup.year" class="year-block">
        <div class="year-header">
          <span class="year-number">{{ yearGroup.year }}</span>
          <span class="year-badge">{{ yearGroup.count }} 篇</span>
        </div>

        <div class="year-timeline">
          <div
            v-for="monthGroup in yearGroup.months"
            :key="monthGroup.month"
            class="month-block"
          >
            <div class="month-label">{{ monthGroup.month }} 月</div>

            <div class="posts-list">
              <a
                v-for="post in monthGroup.posts"
                :key="post.link"
                :href="post.link"
                class="timeline-item"
              >
                <div class="timeline-dot"></div>
                <div class="item-content">
                  <div class="item-main">
                    <span class="item-title">{{ post.title }}</span>
                    <span class="item-date">{{ post.date.slice(5) }}</span>
                  </div>
                  <div class="item-tags" v-if="post.categories.length">
                    <span
                      v-for="cat in post.categories.slice(0, 2)"
                      :key="cat"
                      class="cat-chip"
                    >
                      {{ cat }}
                    </span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.archives-wrapper {
  max-width: 860px;
  margin: 0 auto;
  padding: 32px 0 64px;
}

.archives-header {
  margin-bottom: 40px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.archives-title {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--vp-c-text-1);
  margin: 0 0 10px 0;
  border: none;
  padding: 0;
}

.archives-desc {
  font-size: 15px;
  color: var(--vp-c-text-2);
  margin: 0;
}

.highlight {
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.timeline-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.year-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 20px;
}

.year-number {
  font-size: 26px;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.year-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 9999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  border: 1px solid var(--vp-c-divider);
}

.year-timeline {
  position: relative;
  padding-left: 20px;
  border-left: 2px solid var(--vp-c-divider);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.month-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  margin-bottom: 10px;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.timeline-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  text-decoration: none !important;
  color: inherit !important;
  transition: all 0.2s ease;
}

.timeline-item:hover {
  background: var(--vp-c-bg-soft);
}

.timeline-dot {
  position: absolute;
  left: -26px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--vp-c-bg-elv);
  border: 2px solid var(--vp-c-text-3);
  transition: all 0.2s ease;
}

.timeline-item:hover .timeline-dot {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-1);
  transform: scale(1.2);
}

.item-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 16px;
}

.item-main {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.item-title {
  font-size: 14.5px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  transition: color 0.2s ease;
}

.timeline-item:hover .item-title {
  color: var(--vp-c-brand-1);
}

.item-date {
  font-size: 12px;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}

.item-tags {
  display: flex;
  gap: 6px;
}

.cat-chip {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-3);
  border: 1px solid var(--vp-c-divider);
  white-space: nowrap;
}

@media (max-width: 640px) {
  .item-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
