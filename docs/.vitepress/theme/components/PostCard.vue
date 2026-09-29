<script setup lang="ts">
import type { Post } from '../../data/posts.data'

defineProps<{ post: Post }>()

const labels: Record<string, string> = { java: '后端开发', android: 'Android', ml: '机器学习', crypto: '密码学', cmd: '命令手册', other: '技术随笔' }

function renderExcerpt(value?: string) {
  if (!value) return ''
  const escaped = value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] || character)
  return escaped.replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/__([^_]+)__/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>').replace(/_([^_]+)_/g, '<em>$1</em>').replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
}
</script>

<template>
  <a :href="post.link" class="post-card">
    <span v-if="post.sticky" class="sticky-corner">TOP</span>
    <div class="post-title-row"><h3>{{ post.title }} <span v-if="post.titleTag" class="title-tag">{{ post.titleTag }}</span><span v-if="post.recommend" class="title-tag recommend">推荐</span></h3><span class="arrow">→</span></div>
    <div class="post-meta"><span class="track">{{ labels[post.track] || '技术笔记' }}</span><span>{{ post.date || '持续更新' }}</span><span>约 {{ post.readingTime }} 分钟</span></div>
    <p v-if="post.excerpt" v-html="renderExcerpt(post.excerpt)"></p>
    <div v-if="post.categories.length || post.tags.length" class="chips"><a v-for="item in post.categories.slice(0, 2)" :key="`category-${item}`" :href="`/categories/?category=${encodeURIComponent(item)}`" @click.stop>#{{ item }}</a><a v-for="item in post.tags.slice(0, 1)" :key="`tag-${item}`" :href="`/tags/?tag=${encodeURIComponent(item)}`" @click.stop>#{{ item }}</a></div>
  </a>
</template>

<style scoped>
.post-card{position:relative;display:block;overflow:hidden;padding:18px 20px 40px;border:1px solid var(--vp-c-divider);background:var(--vp-c-bg-elv);color:inherit;text-decoration:none;transition:border-color .2s,transform .2s,box-shadow .2s}.post-card::before{position:absolute;top:0;bottom:0;left:0;width:2px;background:var(--vp-c-brand-1);content:'';opacity:0;transition:opacity .2s}.post-card:hover,.post-card:focus-visible{border-color:color-mix(in srgb,var(--vp-c-brand-1) 55%,var(--vp-c-divider));box-shadow:0 8px 20px rgba(20,30,40,.06);transform:translateY(-2px);outline:none}.post-card:hover::before,.post-card:focus-visible::before{opacity:1}.post-card:focus-visible{box-shadow:0 0 0 2px var(--vp-c-brand-1)}.sticky-corner{position:absolute;top:0;right:0;padding:3px 8px 4px 10px;background:#ef4444;color:#fff;font:700 10px var(--vp-font-family-mono);letter-spacing:.08em;clip-path:polygon(14% 0,100% 0,100% 100%,0 100%)}.post-title-row{display:block}.post-title-row h3{margin:0;font-size:17px;line-height:1.45}.title-tag{display:inline-block;padding:2px 6px;margin-left:5px;border-radius:4px;background:var(--vp-c-brand-soft);color:var(--vp-c-brand-1);font-size:10px;font-weight:600;vertical-align:middle}.title-tag.recommend{background:rgba(245,158,11,.14);color:#b45309}.arrow{position:absolute;right:18px;bottom:16px;color:var(--vp-c-text-3);font-size:18px;line-height:1;transition:color .2s,transform .2s}.post-card:hover .arrow,.post-card:focus-visible .arrow{color:var(--vp-c-brand-1);transform:translateX(3px)}.post-meta{display:flex;gap:12px;flex-wrap:wrap;margin-top:8px;color:var(--vp-c-text-3);font-size:12px}.track{color:var(--vp-c-brand-1)}.post-card p{margin:10px 0 0;color:var(--vp-c-text-2);font-size:13px;line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.post-card p :deep(strong){color:var(--vp-c-text-1);font-weight:650}.post-card p :deep(code){padding:1px 4px;background:var(--vp-c-bg-soft);color:var(--vp-c-brand-1);font:11px var(--vp-font-family-mono)}.post-card p :deep(a){color:var(--vp-c-brand-1);text-decoration:underline;text-underline-offset:2px}.chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.chips a{color:var(--vp-c-text-3);font-size:11px;text-decoration:none}.chips a:hover{color:var(--vp-c-brand-1)}
</style>
