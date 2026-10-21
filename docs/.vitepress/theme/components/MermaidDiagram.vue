<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, useId, watch } from 'vue'
import { useData } from 'vitepress'

const props = defineProps<{ source: string }>()
const { isDark } = useData()
const id = `mermaid-${useId().replace(/[^a-zA-Z0-9-]/g, '-')}`
const svg = ref('')
const error = ref('')
const viewer = ref<HTMLDialogElement>()
const zoom = ref(100)
const imageSource = computed(() => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.value)}`)

function openViewer() {
  zoom.value = 100
  viewer.value?.showModal()
}
let revision = 0

onMounted(() => {
  watch([() => props.source, isDark], async () => {
    const current = ++revision
    error.value = ''
    try {
      const { default: mermaid } = await import('mermaid')
      if (current !== revision) return
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: isDark.value ? 'dark' : 'default',
        suppressErrorRendering: true,
        sequence: { useMaxWidth: false }
      })
      const result = await mermaid.render(`${id}-${current}`, decodeURIComponent(props.source))
      if (current === revision) svg.value = result.svg
    } catch (cause) {
      if (current !== revision) return
      svg.value = ''
      error.value = cause instanceof Error ? cause.message : String(cause)
    }
  }, { immediate: true })
})

onBeforeUnmount(() => { revision++ })
</script>

<template>
  <div class="mermaid-diagram">
    <p v-if="error" role="alert">Mermaid 图表渲染失败：{{ error }}</p>
    <div v-if="svg" class="diagram-toolbar">
      <button type="button" @click="openViewer">放大查看 ↗</button>
    </div>
    <div v-if="svg" class="mermaid-svg" v-html="svg" />
    <pre v-else><code>{{ decodeURIComponent(source) }}</code></pre>
    <dialog ref="viewer" class="diagram-viewer" aria-label="时序图放大查看" @click="($event.target === viewer) && viewer?.close()">
      <div class="viewer-toolbar">
        <span>图表预览</span>
        <label>缩放 <input v-model.number="zoom" type="range" min="50" max="250" step="10" /> {{ zoom }}%</label>
        <button type="button" @click="zoom = 100">适应宽度</button>
        <button type="button" autofocus @click="viewer?.close()">关闭</button>
      </div>
      <div class="viewer-canvas">
        <img class="no-zoom" :src="imageSource" alt="Mermaid 图表放大预览" :style="{ width: `${zoom}%` }" />
      </div>
    </dialog>
  </div>
</template>

<style scoped>
.mermaid-diagram {
  margin: 24px 0;
  min-width: 0;
}

.diagram-toolbar,
.viewer-toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  padding: 8px 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

button {
  padding: 5px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
}

button:hover {
  color: var(--vp-c-brand-1);
}

button:focus-visible,
input:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

.mermaid-svg :deep(svg) {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
}

.diagram-viewer {
  width: 96vw;
  max-width: 1800px;
  height: 92vh;
  max-height: 92vh;
  margin: auto;
  padding: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.diagram-viewer[open] {
  display: flex;
  flex-direction: column;
}

.diagram-viewer::backdrop {
  background: rgb(0 0 0 / 65%);
}

.viewer-toolbar {
  flex-shrink: 0;
  flex-wrap: wrap;
  padding: 12px 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.viewer-toolbar > span {
  margin-right: auto;
  font-weight: 600;
}

.viewer-toolbar label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.viewer-canvas {
  overflow: auto;
  padding: 20px;
  flex: 1;
  min-height: 0;
}

.viewer-canvas img {
  display: block;
  max-width: none;
  height: auto;
}

[role='alert'] {
  color: var(--vp-c-danger-1);
}
</style>
