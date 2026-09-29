<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vitepress'
import { data as postsData } from '../../data/posts.data'
import PostCard from './PostCard.vue'

const route = useRoute()
const router = useRouter()
const categories = postsData.categories
const selectedCategory = ref(typeof route.query?.category === 'string' ? route.query.category : 'all')
const pageSize = 8
const storageKey = 'yang-blog:categories-state'
const currentPage = ref(Math.max(1, Number(route.query?.page) || 1))

function readStoredState() {
  if (typeof sessionStorage === 'undefined') return null
  try { return JSON.parse(sessionStorage.getItem(storageKey) || 'null') as { category?: string; page?: number } | null } catch { return null }
}

function saveState() {
  if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(storageKey, JSON.stringify({ category: selectedCategory.value, page: currentPage.value }))
}

const activePosts = computed(() => {
  if (selectedCategory.value === 'all') return postsData.posts
  return categories.find(category => category.name === selectedCategory.value)?.posts || []
})
const pageCount = computed(() => Math.max(1, Math.ceil(activePosts.value.length / pageSize)))
const pagedPosts = computed(() => activePosts.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize))
const pageItems = computed<(number | 'ellipsis')[]>(() => pageCount.value <= 7 ? Array.from({ length: pageCount.value }, (_, i) => i + 1) : [1, 2, 3, 'ellipsis', pageCount.value - 1, pageCount.value])

watch(() => [route.query?.category, route.query?.page], ([category, page]) => {
  selectedCategory.value = typeof category === 'string' && categories.some(item => item.name === category) ? category : 'all'
  currentPage.value = Math.max(1, Number(page) || 1)
})

onMounted(() => {
  if (route.query?.category || route.query?.page) return
  const stored = readStoredState()
  if (stored?.category || stored?.page) {
    selectedCategory.value = stored.category && categories.some(category => category.name === stored.category) ? stored.category : 'all'
    currentPage.value = Math.max(1, Number(stored.page) || 1)
  }
})

function selectCategory(name: string) {
  selectedCategory.value = name
  currentPage.value = 1
  saveState()
  router.push({ path: route.path, query: name === 'all' ? {} : { category: name } })
}
function goToPage(page: number) {
  currentPage.value = page
  saveState()
  router.push({ path: route.path, query: { ...(selectedCategory.value === 'all' ? {} : { category: selectedCategory.value }), ...(page > 1 ? { page: String(page) } : {}) } })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="index-layout">
    <main class="index-main">
      <header class="index-header"><span class="index-kicker">TOPIC INDEX</span><h1>文章分类体系</h1><p>按技术领域整理的学习路径，共 <strong>{{ categories.length }}</strong> 个分类。</p></header>
      <div class="active-bar"><span>当前分类 <strong>{{ selectedCategory === 'all' ? '全部文章' : selectedCategory }}</strong></span><span>{{ activePosts.length }} 篇</span></div>
      <div class="index-post-list">
        <PostCard v-for="post in pagedPosts" :key="post.link" :post="post" />
      </div>
      <nav v-if="pageCount > 1" class="index-pagination" aria-label="分类文章分页"><button type="button" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">←</button><template v-for="(page, index) in pageItems" :key="`${page}-${index}`"><span v-if="page === 'ellipsis'">…</span><button v-else type="button" :class="{ active: currentPage === page }" @click="goToPage(page)">{{ page }}</button></template><button type="button" :disabled="currentPage === pageCount" @click="goToPage(currentPage + 1)">→</button></nav>
    </main>
    <aside class="index-sidebar">
      <div class="index-panel"><span class="index-kicker">BROWSE BY</span><h2>分类索引</h2><button type="button" :class="{ active: selectedCategory === 'all' }" @click="selectCategory('all')"><span>全部文章</span><em>{{ postsData.posts.length }}</em></button><button v-for="category in categories" :key="category.name" type="button" :class="{ active: selectedCategory === category.name }" @click="selectCategory(category.name)"><span>{{ category.name }}</span><em>{{ category.count }}</em></button></div>
    </aside>
  </div>
</template>

<style scoped>
.index-layout{max-width:1120px;margin:0 auto;padding:34px 24px 70px;display:grid;grid-template-columns:minmax(0,1fr) 235px;gap:32px}.index-header{padding:4px 0 22px;border-bottom:1px solid var(--vp-c-divider)}.index-kicker{color:var(--vp-c-text-3);font:600 10px var(--vp-font-family-mono);letter-spacing:.16em}.index-header h1{margin:8px 0 8px;color:var(--vp-c-text-1);font-size:30px;line-height:1.2}.index-header p{margin:0;color:var(--vp-c-text-2);font-size:14px}.index-header strong{color:var(--vp-c-brand-1)}.active-bar{display:flex;justify-content:space-between;align-items:center;padding:18px 0 12px;color:var(--vp-c-text-3);font-size:12px}.active-bar strong{color:var(--vp-c-text-1);font-weight:600}.index-post-list{display:grid;gap:10px}.index-post-card{position:relative;display:block;padding:16px 18px 14px;border:1px solid var(--vp-c-divider);background:var(--vp-c-bg-elv);color:inherit;text-decoration:none;transition:border-color .2s,transform .2s,box-shadow .2s}.index-post-card:hover{border-color:var(--vp-c-brand-1);box-shadow:0 8px 22px rgba(20,30,40,.06);transform:translateY(-2px)}.index-post-top{display:flex;justify-content:space-between;align-items:baseline;gap:16px}.index-post-top h2{margin:0;color:var(--vp-c-text-1);font-size:16px;line-height:1.45}.index-post-top time{flex:0 0 auto;color:var(--vp-c-text-3);font:11px var(--vp-font-family-mono)}.index-post-card p{margin:8px 0 12px;overflow:hidden;color:var(--vp-c-text-2);font-size:13px;line-height:1.55;text-overflow:ellipsis;white-space:nowrap}.index-post-bottom{display:flex;justify-content:space-between;color:var(--vp-c-text-3);font-size:11px}.index-arrow{color:var(--vp-c-brand-1);font-size:16px;line-height:1}.index-sidebar{padding-top:68px}.index-panel{position:sticky;top:88px;padding:17px 16px;border-top:2px solid var(--vp-c-brand-1);background:var(--vp-c-bg-elv);box-shadow:0 8px 22px rgba(20,30,40,.045)}.index-panel h2{margin:8px 0 13px;color:var(--vp-c-text-1);font-size:17px}.index-panel button{display:flex;width:100%;justify-content:space-between;align-items:center;padding:8px 0;border:0;border-bottom:1px solid var(--vp-c-divider);background:transparent;color:var(--vp-c-text-2);font-size:12px;text-align:left;cursor:pointer;transition:color .2s,padding .2s}.index-panel button:hover,.index-panel button.active{padding-left:6px;color:var(--vp-c-brand-1)}.index-panel button.active{font-weight:650}.index-panel em{color:var(--vp-c-text-3);font:11px var(--vp-font-family-mono);font-style:normal}@media(max-width:760px){.index-layout{grid-template-columns:1fr;padding:24px 16px 55px}.index-sidebar{order:-1;padding-top:0}.index-panel{position:static}.index-header h1{font-size:26px}}@media(max-width:520px){.index-post-top{display:block}.index-post-top time{display:block;margin-top:5px}.index-post-card p{white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}}
</style>

<style scoped>
.index-layout { width:100%; max-width:960px; grid-template-columns:minmax(0,640px) 220px !important; justify-content:center; box-sizing:border-box; }
.index-main { min-width:0; max-width:640px; }
.index-sidebar { min-width:0; }
.index-panel { position:static !important; }
.index-post-card { position:relative; overflow:hidden; padding:18px 20px 40px; }
.index-post-top h2 { font-size:17px; }
.index-post-top { display:block; }
.index-post-top .index-arrow { position:absolute; right:18px; bottom:16px; }
.index-post-meta { display:flex; gap:12px; margin-top:8px; color:var(--vp-c-text-3); font-size:12px; }
.index-post-card p { margin:10px 0 0; }
.index-post-bottom { display:flex; gap:8px; margin-top:12px; }
@media(max-width:760px) { .index-layout { grid-template-columns:1fr !important; } .index-main { max-width:none; } }
</style>

<style scoped>
.index-layout { width:100%; max-width:1200px; grid-template-columns:minmax(0,1fr) 260px !important; gap:24px; }
.index-main { min-width:0; max-width:none; }
.index-panel { position:static !important; max-height:460px; overflow-y:auto; scrollbar-width:thin; scrollbar-color:var(--vp-c-divider) transparent; }
.index-post-card:hover,.index-post-card:focus-visible { border-color:var(--vp-c-brand-1); background:var(--vp-c-brand-soft); box-shadow:0 8px 22px rgba(20,30,40,.08); outline:none; }
.index-post-card:focus-visible,.index-panel button:focus-visible { outline:2px solid var(--vp-c-brand-1); outline-offset:2px; }
@media(max-width:760px) { .index-layout { grid-template-columns:1fr !important; } .index-main { max-width:none; } .index-panel { max-height:none; } }
</style>

<style scoped>
.index-layout { max-width:1000px; grid-template-columns:minmax(0,700px) 220px; justify-content:center; gap:30px; }
.index-sidebar { padding-top:68px; }
.index-panel { position:static; }
@media (max-width:760px) { .index-layout { grid-template-columns:1fr; } .index-sidebar { padding-top:0; } }
</style>

<style scoped>
.index-layout { max-width:1200px !important; }
.index-panel { max-height:460px; overflow-y:auto; }
.index-pagination { display:flex; justify-content:center; align-items:center; gap:6px; margin-top:22px; }
.index-pagination button { min-width:32px; height:32px; border:1px solid var(--vp-c-divider); background:var(--vp-c-bg-elv); color:var(--vp-c-text-2); cursor:pointer; }
.index-pagination button.active,.index-pagination button:hover:not(:disabled) { border-color:var(--vp-c-brand-1); background:var(--vp-c-brand-soft); color:var(--vp-c-brand-1); }
.index-pagination button:disabled { opacity:.35; cursor:not-allowed; }
.index-pagination span { width:18px; color:var(--vp-c-text-3); text-align:center; }
</style>
