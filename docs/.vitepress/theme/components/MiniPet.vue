<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import { gsap } from 'gsap'

type PetMood = 'exploring' | 'reading' | 'scrolling' | 'typing' | 'sleeping' | 'happy'

const route = useRoute()
const { page } = useData()
const mood = ref<PetMood>('exploring')
const messageOpen = ref(false)
const frame = ref(0)
let idleTimer: ReturnType<typeof setTimeout> | undefined
let scrollTimer: ReturnType<typeof setTimeout> | undefined
let happyTimer: ReturnType<typeof setTimeout> | undefined
let animationTimer: ReturnType<typeof setInterval> | undefined
const button = ref<HTMLElement | null>(null)

// The Codex Mini sheet has 8 columns of 192px and 11 rows of 208px.
const sequences: Record<PetMood, { row: number; columns: number[] }> = {
  exploring: { row: 0, columns: [0, 0, 0, 1, 2, 3, 4, 5] },
  reading: { row: 6, columns: [0, 0, 1, 2, 3, 4, 5] },
  scrolling: { row: 1, columns: [0, 1, 2, 3, 4, 5, 6, 7] },
  typing: { row: 7, columns: [0, 1, 2, 3, 4, 5] },
  sleeping: { row: 0, columns: [1] },
  happy: { row: 3, columns: [0, 1, 2, 3, 2, 1] }
}

const isReadingPage = computed(() => route.path !== '/' && !page.value.isNotFound)
const currentMood = computed<PetMood>(() => {
  if (mood.value === 'happy' || mood.value === 'typing' || mood.value === 'scrolling' || mood.value === 'sleeping') {
    return mood.value
  }
  return isReadingPage.value ? 'reading' : 'exploring'
})
const spriteStyle = computed(() => {
  const sequence = sequences[currentMood.value]
  const column = sequence.columns[frame.value % sequence.columns.length]
  return { backgroundPosition: `-${column * 96}px -${sequence.row * 104}px` }
})

const messages: Record<PetMood, string> = {
  exploring: '一起逛逛吧',
  reading: '认真阅读中',
  scrolling: '跟上你的脚步！',
  typing: '灵感正在输入…',
  sleeping: 'Zzz… 轻点叫醒我',
  happy: '嘿！很高兴见到你'
}

function isTextInput(target: EventTarget | null) {
  return target instanceof HTMLElement && Boolean(target.closest('input, textarea, [contenteditable="true"]'))
}

function resetIdleTimer() {
  window.clearTimeout(idleTimer)
  if (mood.value === 'sleeping') mood.value = 'exploring'
  idleTimer = window.setTimeout(() => {
    if (!isTextInput(document.activeElement)) mood.value = 'sleeping'
  }, 60000)
}

function onScroll() {
  if (mood.value === 'happy' || mood.value === 'typing') return
  mood.value = 'scrolling'
  resetIdleTimer()
  window.clearTimeout(scrollTimer)
  scrollTimer = window.setTimeout(() => { mood.value = 'exploring' }, 1200)
}

function onFocusIn(event: FocusEvent) {
  resetIdleTimer()
  if (isTextInput(event.target)) mood.value = 'typing'
}

function onFocusOut() {
  window.setTimeout(() => {
    if (!isTextInput(document.activeElement) && mood.value === 'typing') mood.value = 'exploring'
  }, 0)
}

function onVisibilityChange() {
  if (document.hidden) {
    window.clearTimeout(idleTimer)
    window.clearTimeout(scrollTimer)
    mood.value = 'sleeping'
  } else {
    mood.value = isTextInput(document.activeElement) ? 'typing' : 'exploring'
    resetIdleTimer()
  }
}

function greet() {
  window.clearTimeout(happyTimer)
  window.clearTimeout(scrollTimer)
  mood.value = 'happy'
  messageOpen.value = true
  resetIdleTimer()
  happyTimer = window.setTimeout(() => {
    mood.value = isTextInput(document.activeElement) ? 'typing' : 'exploring'
    messageOpen.value = false
  }, 3200)
}

watch(currentMood, nextMood => {
  const element = button.value
  if (!element || document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  gsap.killTweensOf(element)
  if (nextMood === 'happy') {
    gsap.timeline().to(element, { y: -11, scale: 1.08, duration: 0.2, ease: 'power2.out' })
      .to(element, { y: 0, scale: 1, duration: 0.38, ease: 'bounce.out', clearProps: 'transform' })
  } else if (nextMood === 'sleeping') {
    gsap.to(element, { y: 4, scale: 0.96, duration: 0.45, ease: 'power2.out' })
  } else {
    gsap.to(element, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out', clearProps: 'transform' })
  }
}, { flush: 'post' })

onMounted(() => {
  resetIdleTimer()
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animationTimer = window.setInterval(() => {
      if (!document.hidden) frame.value++
    }, 140)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('pointerdown', resetIdleTimer, { passive: true })
  window.addEventListener('keydown', resetIdleTimer)
  document.addEventListener('focusin', onFocusIn)
  document.addEventListener('focusout', onFocusOut)
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onBeforeUnmount(() => {
  if (button.value) gsap.killTweensOf(button.value)
  window.clearTimeout(idleTimer)
  window.clearTimeout(scrollTimer)
  window.clearTimeout(happyTimer)
  window.clearInterval(animationTimer)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('pointerdown', resetIdleTimer)
  window.removeEventListener('keydown', resetIdleTimer)
  document.removeEventListener('focusin', onFocusIn)
  document.removeEventListener('focusout', onFocusOut)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>

<template>
  <div class="mini-pet">
    <span class="mini-pet__message" :class="{ 'mini-pet__message--open': messageOpen }" aria-hidden="true">{{ messages[currentMood] }}</span>
    <button ref="button" class="mini-pet__button" type="button" :aria-label="`Codex Mini：${messages[currentMood]}。点击和它打招呼`" @click="greet">
      <span class="mini-pet__sprite" :style="spriteStyle" aria-hidden="true"></span>
    </button>
  </div>
</template>

<style scoped>
.mini-pet { position: fixed; left: 17px; bottom: 14px; z-index: 39; width: 96px; height: 104px; }
.mini-pet__button { display: block; width: 96px; height: 104px; padding: 0; border: 0; background: none; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.mini-pet__button:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; border-radius: 12px; }
.mini-pet__sprite { display: block; width: 96px; height: 104px; background-image: url('/img/codex-mini-spritesheet.webp'); background-repeat: no-repeat; background-size: 768px 1144px; image-rendering: auto; filter: drop-shadow(0 5px 8px rgba(17, 34, 85, .2)); }
.mini-pet__message { position: absolute; left: 82px; bottom: 56px; width: max-content; max-width: min(180px, calc(100vw - 112px)); padding: 8px 11px; border: 1px solid var(--vp-c-divider); border-radius: 12px 12px 12px 3px; background: var(--vp-c-bg-elv); box-shadow: 0 8px 24px rgba(14, 30, 61, .13); color: var(--vp-c-text-1); font-size: 12px; font-weight: 600; line-height: 1.5; opacity: 0; pointer-events: none; transform: translate(-5px, 5px); transition: opacity .2s, transform .2s; }
.mini-pet:hover .mini-pet__message, .mini-pet:focus-within .mini-pet__message, .mini-pet__message--open { opacity: 1; transform: translate(0, 0); }
@media (max-width: 640px) { .mini-pet { left: 5px; bottom: 5px; transform: scale(.8); transform-origin: bottom left; } }
@media (prefers-reduced-motion: reduce) { .mini-pet__message { transition: none; } }
</style>
