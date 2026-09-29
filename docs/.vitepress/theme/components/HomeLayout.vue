<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vitepress'
import { data as postsData } from '../../data/posts.data'
import WebInfo from './WebInfo.vue'
import PostCard from './PostCard.vue'
import { siteConfig } from '../../site.config'

const sortedPosts = computed(() => [...postsData.posts].sort((a, b) => {
  if (a.sticky !== b.sticky) return b.sticky - a.sticky
  if (a.recommend !== b.recommend) return Number(b.recommend) - Number(a.recommend)
  return (b.date || '').localeCompare(a.date || '')
}))
const route = useRoute()
const router = useRouter()
const pageSize = 8
const pageStorageKey = 'yang-blog:home-page'
const pageCount = computed(() => Math.max(1, Math.ceil(sortedPosts.value.length / pageSize)))
function parsePage(value: unknown) {
  const page = Number(value)
  return Number.isInteger(page) && page > 0 ? Math.min(page, pageCount.value) : 0
}
const initialPage = parsePage(route.query?.page)
const currentPage = ref(initialPage || 1)
watch(() => route.query?.page, value => {
  const page = parsePage(value)
  if (page) {
    currentPage.value = page
    return
  }
  const stored = parsePage(sessionStorage.getItem(pageStorageKey))
  currentPage.value = stored || 1
})
onMounted(() => {
  if (!initialPage) {
    const stored = parsePage(sessionStorage.getItem(pageStorageKey))
    if (stored) currentPage.value = stored
  }
})
const posts = computed(() => sortedPosts.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize))
const pageItems = computed<(number | 'ellipsis')[]>(() => {
  const total = pageCount.value
  const current = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, 'ellipsis', total]
  if (current >= total - 3) return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total]
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total]
})
const categories = computed(() => postsData.categories.slice(0, 10))

function goToPage(page: number) {
  currentPage.value = Math.min(Math.max(page, 1), pageCount.value)
  if (currentPage.value === 1) sessionStorage.removeItem(pageStorageKey)
  else sessionStorage.setItem(pageStorageKey, String(currentPage.value))
  router.push({ path: route.path, query: currentPage.value === 1 ? {} : { page: String(currentPage.value) } })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="home-layout">
    <main class="home-main">
      <div class="list-heading"><div><span class="kicker">LATEST NOTES</span><h2>最新文章</h2></div><a href="/archives/">全部文章 →</a></div>
      <div class="post-list">
        <PostCard v-for="post in posts" :key="post.link" :post="post" />
      </div>
      <nav v-if="pageCount > 1" class="pagination" aria-label="文章分页">
        <button type="button" :disabled="currentPage === 1" aria-label="上一页" @click="goToPage(currentPage - 1)">←</button>
        <template v-for="(page, index) in pageItems" :key="`${page}-${index}`">
          <span v-if="page === 'ellipsis'" class="pagination-ellipsis" aria-hidden="true">…</span>
          <button v-else type="button" :class="{ active: currentPage === page }" :aria-current="currentPage === page ? 'page' : undefined" @click="goToPage(page)">{{ page }}</button>
        </template>
        <button type="button" :disabled="currentPage === pageCount" aria-label="下一页" @click="goToPage(currentPage + 1)">→</button>
      </nav>
    </main>
    <aside class="home-side">
      <section class="side-card profile-card">
        <div class="avatar-wrap"><img :src="siteConfig.author.avatar" :alt="`${siteConfig.author.name} 的头像`" /></div>
        <h2>{{ siteConfig.author.name }}</h2>
        <p>{{ siteConfig.author.motto }}</p>
        <div class="socials">
          <a :href="siteConfig.links.github" target="_blank" rel="noopener" aria-label="访问 GitHub 主页">
            <svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .6a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.4.7-4.1-1.6-4.1-1.6-.5-1.4-1.3-1.8-1.3-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.4-5.5-6A4.7 4.7 0 0 1 5.6 9c-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2a4.7 4.7 0 0 1 1.3 3.3c0 4.6-2.8 5.7-5.5 6 .4.3.8 1 .8 2v3c0 .3.2.7.8.6A12 12 0 0 0 12 .6Z" /></svg>
            <span>GitHub</span>
          </a>
          <a :href="`mailto:${siteConfig.links.email}`" aria-label="发送 Email">
            <svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" /></svg>
            <span>Email</span>
          </a>
        </div>
      </section>
      <WebInfo />
      <section class="side-card category-card"><h3>文章分类</h3><a v-for="cat in categories" :key="cat.name" :href="`/categories/?category=${encodeURIComponent(cat.name)}`"><span>{{ cat.name }}</span><em>{{ cat.count }}</em></a><a class="more" href="/categories/">查看全部分类 →</a></section>
    </aside>
  </div>
</template>

<style scoped>
.home-layout{max-width:1200px;margin:0 auto;padding:28px 24px 70px;display:grid;grid-template-columns:minmax(0,1fr) 260px;gap:24px}.list-heading{display:flex;justify-content:space-between;align-items:end;margin-bottom:14px}.list-heading h2{margin:5px 0 0;font-size:23px}.list-heading a{display:inline-flex;align-items:center;min-height:32px;padding:0 12px;border:1px solid var(--vp-c-divider);border-radius:6px;color:var(--vp-c-brand-1);font-size:12px;text-decoration:none;transition:color .2s,border-color .2s,background-color .2s,transform .2s}.list-heading a:hover{border-color:var(--vp-c-brand-1);background:var(--vp-c-brand-soft);transform:translateY(-1px)}.kicker{font:600 11px var(--vp-font-family-mono);letter-spacing:.08em;color:var(--vp-c-text-3)}.post-list{display:grid;gap:10px}.post-card{position:relative;display:block;overflow:hidden;padding:18px 20px 40px;border:1px solid var(--vp-c-divider);background:var(--vp-c-bg-elv);color:inherit;text-decoration:none;transition:border-color .2s,transform .2s,box-shadow .2s}.post-card::before{position:absolute;top:0;bottom:0;left:0;width:2px;background:var(--vp-c-brand-1);content:'';opacity:0;transition:opacity .2s}.post-card:hover{border-color:color-mix(in srgb,var(--vp-c-brand-1) 55%,var(--vp-c-divider));box-shadow:0 8px 20px rgba(20,30,40,.06);transform:translateY(-2px)}.post-card:hover::before{opacity:1}.sticky-corner{position:absolute;top:0;right:0;padding:3px 8px 4px 10px;background:#ef4444;color:#fff;font:700 10px var(--vp-font-family-mono);letter-spacing:.08em;clip-path:polygon(14% 0,100% 0,100% 100%,0 100%)}.post-title-row{display:block}.post-title-row h3{margin:0;font-size:17px;line-height:1.45}.title-tag{display:inline-block;padding:2px 6px;margin-left:5px;border-radius:4px;background:var(--vp-c-brand-soft);color:var(--vp-c-brand-1);font-size:10px;font-weight:600;vertical-align:middle}.title-tag.recommend{background:rgba(245,158,11,.14);color:#b45309}.arrow{position:absolute;right:18px;bottom:16px;color:var(--vp-c-text-3);font-size:18px;line-height:1;transition:color .2s,transform .2s}.post-card:hover .arrow{color:var(--vp-c-brand-1);transform:translateX(3px)}.post-meta{display:flex;gap:12px;flex-wrap:wrap;margin-top:8px;color:var(--vp-c-text-3);font-size:12px}.track{color:var(--vp-c-brand-1)}.post-card p{margin:10px 0 0;color:var(--vp-c-text-2);font-size:13px;line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.post-card p :deep(strong){color:var(--vp-c-text-1);font-weight:650}.post-card p :deep(code){padding:1px 4px;background:var(--vp-c-bg-soft);color:var(--vp-c-brand-1);font:11px var(--vp-font-family-mono)}.post-card p :deep(a){color:var(--vp-c-brand-1);text-decoration:underline;text-underline-offset:2px}.chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.chips span{color:var(--vp-c-text-3);font-size:11px}.home-side{display:grid;align-content:start;gap:12px}.side-card{padding:18px;border:1px solid var(--vp-c-divider);background:var(--vp-c-bg-elv)}.profile-card{position:relative;overflow:hidden;margin-top:30px;text-align:center;background:linear-gradient(145deg,var(--vp-c-bg-elv),var(--vp-c-bg-soft));border-top:2px solid var(--vp-c-brand-1);box-shadow:0 10px 24px rgba(20,30,40,.06)}.profile-card::after{position:absolute;right:-34px;bottom:-46px;width:120px;height:120px;border:1px solid color-mix(in srgb,var(--vp-c-brand-1) 22%,transparent);border-radius:50%;content:'';pointer-events:none}.avatar-wrap{display:flex;justify-content:center;align-items:center;width:100%}.profile-card img{display:block;width:92px;height:92px;object-fit:cover;border-radius:50%;border:2px solid var(--vp-c-bg-elv);box-shadow:0 0 0 1px var(--vp-c-divider)}.profile-card h2{margin:12px 0 4px;font-size:20px}.profile-card p{margin:0;color:var(--vp-c-text-2);font-size:13px}.socials{display:flex;justify-content:center;gap:10px;margin-top:16px}.socials a{display:inline-flex;align-items:center;min-height:32px;gap:6px;padding:0 9px;border:1px solid var(--vp-c-divider);border-radius:6px;color:var(--vp-c-text-2);font-size:12px;text-decoration:none;transition:color .2s,border-color .2s,background-color .2s,transform .2s}.socials a:hover{color:var(--vp-c-brand-1);border-color:var(--vp-c-brand-1);background:var(--vp-c-brand-soft);transform:translateY(-1px)}.social-icon{width:15px;height:15px;flex:0 0 15px}.side-card h3{margin:0 0 14px;font-size:16px}.site-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.site-stats div{text-align:center}.site-stats strong{display:block;font-size:19px}.site-stats span{font-size:11px;color:var(--vp-c-text-3)}.category-card a{display:flex;justify-content:space-between;gap:12px;padding:8px 0;color:var(--vp-c-text-2);font-size:13px;text-decoration:none;border-bottom:1px solid var(--vp-c-divider)}.category-card a:hover{color:var(--vp-c-brand-1)}.category-card em{font-style:normal;color:var(--vp-c-text-3);font-size:12px}.category-card .more{margin-top:8px;border:0;color:var(--vp-c-brand-1)}
@media(max-width:800px){.home-layout{grid-template-columns:1fr;padding:20px 16px 50px}.home-side{grid-template-columns:repeat(2,minmax(0,1fr))}.profile-card{grid-row:span 2;margin-top:0}.category-card{grid-column:span 1}}@media(max-width:560px){.home-side{grid-template-columns:1fr}.profile-card{grid-row:auto}}
</style>

<style scoped>
.pagination { display:flex; justify-content:center; align-items:center; gap:6px; margin-top:22px; }
.pagination button { min-width:32px; height:32px; padding:0 9px; border:1px solid var(--vp-c-divider); background:var(--vp-c-bg-elv); color:var(--vp-c-text-2); font:500 12px var(--vp-font-family-mono); cursor:pointer; transition:color .2s,border-color .2s,background-color .2s; }
.pagination button:hover:not(:disabled), .pagination button.active { border-color:var(--vp-c-brand-1); background:var(--vp-c-brand-soft); color:var(--vp-c-brand-1); }
.pagination button.active { font-weight:700; }
.pagination button:disabled { cursor:not-allowed; opacity:.35; }
.pagination-ellipsis { width:18px; color:var(--vp-c-text-3); text-align:center; }
</style>

<style scoped>
.chips a { color:var(--vp-c-text-3); font-size:11px; text-decoration:none; }
.chips a:hover { color:var(--vp-c-brand-1); }
</style>

<style scoped>
/* Keep the archive link quiet and text-like while preserving a comfortable hit area. */
.list-heading a { min-height: 32px; padding: 0; border: 0; border-radius: 0; background: transparent; }
.list-heading a:hover { border: 0; background: transparent; }
</style>
