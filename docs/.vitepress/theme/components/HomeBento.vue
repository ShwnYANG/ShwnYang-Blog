<script setup lang="ts">
import { data as postsData } from '../../data/posts.data'
import { siteConfig } from '../../site.config'

const tracksData = siteConfig.sections.map((section, index) => ({
  ...section,
  desc: section.description,
  count: postsData.tracks[section.id]?.length || 0,
  tags: [...new Set((postsData.tracks[section.id] || []).flatMap(post => post.tags))].slice(0, 5),
  gradient: `linear-gradient(135deg, color-mix(in srgb, ${section.accent} 12%, transparent), transparent)`,
  borderColor: `color-mix(in srgb, ${section.accent} 30%, transparent)`,
  large: index === 0
}))
</script>

<template>
  <section class="bento-section">
    <div class="section-header">
      <div class="header-left">
        <h2 class="section-title">核心技术专栏矩阵</h2>
        <p class="section-desc">结构化知识脉络，沉淀体系化实战与理论深度</p>
      </div>
      <a href="/categories/" class="view-all-link">
        <span>全部分类索引</span>
        <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </a>
    </div>

    <div class="bento-grid">
      <a
        v-for="track in tracksData"
        :key="track.id"
        :href="track.link"
        class="bento-card"
        :class="{ 'card-large': track.large }"
        :style="{
          '--card-bg': track.gradient,
          '--card-border': track.borderColor,
          '--card-accent': track.accent
        }"
      >
        <div class="card-inner">
          <div class="card-top">
            <div class="icon-wrap">
              <img :src="track.icon" :alt="track.title" class="track-icon" />
            </div>
            <div class="count-badge">
              <span class="count-num">{{ track.count }}</span>
              <span class="count-unit">篇</span>
            </div>
          </div>

          <div class="card-middle">
            <h3 class="track-title">{{ track.title }}</h3>
            <p class="track-desc">{{ track.desc }}</p>
          </div>

          <div class="card-bottom">
            <div class="tags-row">
              <span v-for="tag in track.tags" :key="tag" class="track-tag">
                {{ tag }}
              </span>
            </div>
            <span class="arrow-btn">
              <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
          </div>
        </div>
      </a>
    </div>
  </section>
</template>

<style scoped>
.bento-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
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

.view-all-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: gap 0.2s ease;
}

.view-all-link:hover {
  gap: 8px;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.bento-card {
  position: relative;
  border-radius: 16px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  padding: 24px;
  text-decoration: none !important;
  color: inherit !important;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
}

.bento-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--card-bg);
  opacity: 0.5;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.bento-card:hover {
  transform: translateY(-4px);
  border-color: var(--card-border);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}

.bento-card:hover::before {
  opacity: 1;
}

.card-large {
  grid-column: span 2;
}

.card-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.track-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.count-badge {
  display: flex;
  align-items: baseline;
  gap: 2px;
  padding: 4px 10px;
  border-radius: 9999px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.count-num {
  font-size: 15px;
  font-weight: 700;
  color: var(--card-accent);
}

.count-unit {
  font-size: 11px;
  color: var(--vp-c-text-3);
}

.card-middle {
  flex: 1;
  margin-bottom: 20px;
}

.track-title {
  font-size: 19px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 6px 0;
  border: none;
  padding: 0;
}

.track-desc {
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0;
}

.card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 14px;
  border-top: 1px solid var(--vp-c-divider);
}

.tags-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.track-tag {
  font-size: 11px;
  padding: 2px 7px;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}

.arrow-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  transition: all 0.2s ease;
}

.bento-card:hover .arrow-btn {
  background: var(--card-accent);
  color: #fff;
  transform: translateX(3px);
}

@media (max-width: 960px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
  .card-large {
    grid-column: span 1;
  }
}
</style>
