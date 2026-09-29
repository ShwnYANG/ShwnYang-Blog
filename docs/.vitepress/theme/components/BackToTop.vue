<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const threshold = 100
const visible = ref(false)
const progress = ref(0)

const ringStyle = computed(() => ({
  '--back-to-top-progress': `${progress.value * 360}deg`
}))

function updateScrollState() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  const scrollTop = window.scrollY
  visible.value = scrollTop > threshold
  progress.value = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  updateScrollState()
  window.addEventListener('scroll', updateScrollState, { passive: true })
  window.addEventListener('resize', updateScrollState, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateScrollState)
  window.removeEventListener('resize', updateScrollState)
})
</script>

<template>
  <Transition name="back-to-top-fade">
    <button
      v-if="visible"
      class="back-to-top"
      type="button"
      :style="ringStyle"
      aria-label="返回顶部"
      title="返回顶部"
      @click="scrollToTop"
    >
      <span class="back-to-top-ring" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="m6 14 6-6 6 6" />
        </svg>
      </span>
    </button>
  </Transition>
</template>

<style scoped>
.back-to-top {
  --back-to-top-progress: 0deg;
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 40;
  width: 42px;
  height: 42px;
  padding: 3px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 50%;
  background: conic-gradient(var(--vp-c-brand-1) var(--back-to-top-progress), var(--vp-c-bg-soft) 0);
  color: var(--vp-c-brand-1);
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.12);
  cursor: pointer;
  transition: transform .2s ease, box-shadow .2s ease;
}

.back-to-top:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.18);
}

.back-to-top-ring {
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  border-radius: 50%;
  background: var(--vp-c-bg);
}

.back-to-top svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.back-to-top-fade-enter-active,
.back-to-top-fade-leave-active {
  transition: opacity .2s ease, transform .2s ease;
}

.back-to-top-fade-enter-from,
.back-to-top-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 640px) {
  .back-to-top { right: 16px; bottom: 16px; }
}

@media (prefers-reduced-motion: reduce) {
  .back-to-top,
  .back-to-top-fade-enter-active,
  .back-to-top-fade-leave-active { transition: none; }
}
</style>
