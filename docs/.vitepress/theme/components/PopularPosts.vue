<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { data as postsData, type Post } from '../../data/posts.data'

type PopularRow = { path: string; pageviews: number; visitors: number }
type PopularResponse = { posts: PopularRow[] }

const sectionNames: Record<string, string> = {
  java: '后端开发', android: 'Android', ml: '机器学习',
  crypto: '密码学', cmd: '命令手册', other: '技术随笔'
}

function normalizePath(value: string) {
  try {
    return decodeURI(new URL(value, 'https://blog.ywenrou.cn').pathname).replace(/\/+$/, '') || '/'
  } catch {
    return ''
  }
}

const postByPath = new Map<string, Post>(postsData.posts.map(post => [normalizePath(post.link), post]))
const rows = ref<PopularRow[]>([])
const state = ref<'loading' | 'ready' | 'error'>('loading')
const popularPosts = computed(() => {
  const matched = new Map<string, { post: Post; pageviews: number }>()
  for (const row of rows.value) {
    const path = normalizePath(row.path)
    const post = postByPath.get(path)
    if (!post) continue
    const current = matched.get(path)
    matched.set(path, { post, pageviews: (current?.pageviews || 0) + row.pageviews })
  }
  return [...matched.values()].sort((a, b) => b.pageviews - a.pageviews).slice(0, 5)
})

onMounted(async () => {
  try {
    const response = await fetch('/api/popular-posts', { signal: AbortSignal.timeout(10000) })
    if (!response.ok) throw new Error(`Popular posts returned ${response.status}`)
    const result = await response.json() as PopularResponse
    if (!Array.isArray(result.posts)) throw new Error('Invalid popular posts')
    rows.value = result.posts
    state.value = 'ready'
  } catch {
    state.value = 'error'
  }
})
</script>

<template>
  <section class="popular-posts" aria-labelledby="popular-heading">
    <div class="popular-heading">
      <div>
        <span class="popular-kicker">READING LIST</span>
        <h3 id="popular-heading">热门文章</h3>
      </div>
      <span class="popular-period">近 30 天</span>
    </div>
    <ol v-if="popularPosts.length" class="popular-list">
      <li v-for="(item, index) in popularPosts" :key="item.post.link">
        <a :href="item.post.link">
          <span class="popular-rank">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="popular-copy">
            <span class="popular-title">{{ item.post.title }}</span>
            <span class="popular-track">{{ sectionNames[item.post.track] || '技术随笔' }}</span>
          </span>
          <span class="popular-views"><strong>{{ item.pageviews }}</strong><small>浏览</small></span>
        </a>
      </li>
    </ol>
    <p v-else-if="state === 'loading'" class="popular-message" role="status">正在读取阅读数据…</p>
    <p v-else-if="state === 'error'" class="popular-message" role="status">热门文章暂不可用</p>
    <p v-else class="popular-message">近 30 天还没有文章阅读记录</p>
  </section>
</template>

<style scoped>
.popular-posts { padding: 16px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-elv); }
.popular-heading { display: flex; align-items: end; justify-content: space-between; gap: 8px; padding-bottom: 12px; border-bottom: 1px solid var(--vp-c-divider); }
.popular-kicker { color: var(--vp-c-text-3); font: 600 9px/1 var(--vp-font-family-mono); letter-spacing: .14em; }
.popular-heading h3 { margin: 5px 0 0; color: var(--vp-c-text-1); font-size: 15px; line-height: 1.2; font-weight: 650; }
.popular-period { flex: 0 0 auto; padding: 4px 6px; border: 1px solid var(--vp-c-divider); color: var(--vp-c-text-3); font: 10px/1 var(--vp-font-family-mono); }
.popular-list { margin: 0; padding: 0; list-style: none; }
.popular-list li + li { border-top: 1px solid var(--vp-c-divider); }
.popular-list a { display: flex; align-items: center; gap: 9px; min-width: 0; padding: 11px 1px; color: inherit; text-decoration: none; transition: background-color .2s; }
.popular-list a:hover, .popular-list a:focus-visible { background: var(--vp-c-brand-soft); outline: none; }
.popular-rank { flex: 0 0 22px; align-self: flex-start; color: var(--vp-c-text-3); font: 700 15px/1.4 var(--vp-font-family-mono); }
.popular-list li:first-child .popular-rank { color: var(--vp-c-brand-1); }
.popular-copy { display: grid; gap: 4px; min-width: 0; flex: 1; }
.popular-title { overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; color: var(--vp-c-text-1); font-size: 12px; font-weight: 550; line-height: 1.45; }
.popular-track { color: var(--vp-c-text-3); font-size: 10px; line-height: 1.2; }
.popular-views { display: grid; gap: 3px; flex: 0 0 auto; align-self: center; text-align: right; }
.popular-views strong { color: var(--vp-c-text-2); font: 600 13px/1 var(--vp-font-family-mono); }
.popular-views small { color: var(--vp-c-text-3); font-size: 9px; }
.popular-message { margin: 0; padding: 18px 0 2px; color: var(--vp-c-text-3); font-size: 11px; line-height: 1.5; }
@media (max-width: 420px) { .popular-posts { padding: 14px; } }
</style>
