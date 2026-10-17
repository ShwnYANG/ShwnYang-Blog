<script setup lang="ts">
import { useData } from 'vitepress'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const storageKey = 'article-sidebar-collapsed'
const { frontmatter, page } = useData()
const collapsed = ref(false)

const isArticle = computed(() => {
  const path = page.value.relativePath || ''
  return !page.value.isNotFound
    && !frontmatter.value.home
    && frontmatter.value.layout !== 'home'
    && frontmatter.value.layout !== 'page'
    && frontmatter.value.sidebar !== false
    && frontmatter.value.article !== false
    && path !== 'index.md'
    && !path.startsWith('00.目录页/')
    && !path.startsWith('@pages/')
    && !path.startsWith('05.更多/')
})

function syncSidebar() {
  document.documentElement.classList.toggle('article-sidebar-collapsed', isArticle.value && collapsed.value)
}

function toggleSidebar() {
  collapsed.value = !collapsed.value
  try {
    localStorage.setItem(storageKey, String(collapsed.value))
  } catch {
    // The toggle still works when browser storage is unavailable.
  }
}

onMounted(() => {
  try {
    collapsed.value = localStorage.getItem(storageKey) === 'true'
  } catch {
    // Keep the default expanded state when browser storage is unavailable.
  }
  syncSidebar()
})

watch([isArticle, collapsed], syncSidebar, { flush: 'post' })
onUnmounted(() => document.documentElement.classList.remove('article-sidebar-collapsed'))
</script>

<template>
  <button
    v-if="isArticle"
    class="article-sidebar-toggle"
    type="button"
    :aria-label="collapsed ? '展开文件目录' : '收起文件目录'"
    :title="collapsed ? '展开文件目录' : '收起文件目录'"
    :aria-expanded="!collapsed"
    aria-controls="VPSidebarNav"
    @click="toggleSidebar"
  >
    <svg class="toggle-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M12 4.5 6.5 10l5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    <span>目录</span>
  </button>
</template>
