<script setup lang="ts">
import { computed } from 'vue'
import { data as postsData } from '../../data/posts.data'

const pinned = computed(() => postsData.posts.slice(0, 4))
</script>

<template>
  <section class="pinned-section">
    <div class="section-heading"><div><span class="kicker">CURATED NOTES</span><h2>置顶与精选</h2></div><a href="/archives/">查看全部文章 →</a></div>
    <div class="pinned-grid">
      <a v-for="(post, index) in pinned" :key="post.link" :href="post.link" class="pinned-card">
        <span class="index">0{{ index + 1 }}</span>
        <div><div class="post-date">{{ post.date || '持续更新' }} · {{ post.track }}</div><h3>{{ post.title }}</h3><p>{{ post.excerpt || '进入文章阅读完整技术笔记。' }}</p></div>
        <span class="arrow">↗</span>
      </a>
    </div>
  </section>
</template>

<style scoped>
.pinned-section { max-width: 1200px; margin: 0 auto; padding: 28px 24px 10px; }
.section-heading { display:flex; align-items:end; justify-content:space-between; margin-bottom: 16px; }
.section-heading h2 { margin: 4px 0 0; font-size: 23px; }
.section-heading a { color: var(--vp-c-brand-1); font-size: 13px; text-decoration:none; }
.kicker { color: var(--vp-c-text-3); font: 600 11px/1 var(--vp-font-family-mono); letter-spacing:.08em; }
.pinned-grid { display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; }
.pinned-card { display:grid; grid-template-columns: 32px 1fr 18px; gap: 12px; align-items:start; padding: 17px; border:1px solid var(--vp-c-divider); background: var(--vp-c-bg-elv); color:inherit; text-decoration:none; transition: border-color .2s, transform .2s; }
.pinned-card:hover { border-color: var(--vp-c-brand-1); transform: translateY(-2px); }
.index { color: var(--vp-c-brand-1); font: 600 13px var(--vp-font-family-mono); }
.post-date { color: var(--vp-c-text-3); font-size: 11px; text-transform: uppercase; }
h3 { margin: 7px 0 5px; font-size: 15px; line-height:1.45; }
p { margin:0; color:var(--vp-c-text-2); font-size:12px; line-height:1.55; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.arrow { color:var(--vp-c-text-3); }
@media(max-width:700px){ .pinned-grid{grid-template-columns:1fr;} }
</style>
