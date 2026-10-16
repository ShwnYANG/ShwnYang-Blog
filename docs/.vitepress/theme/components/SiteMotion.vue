<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const route = useRoute()
let media: ReturnType<typeof gsap.matchMedia> | undefined
let frame = 0
let version = 0
let pluginRegistered = false
let overlayObserver: MutationObserver | undefined

function motionAllowed() {
  return window.matchMedia('(prefers-reduced-motion: no-preference)').matches
}

function animateOverlay(element: Element) {
  if (!motionAllowed()) return
  if (element.matches('#VPNavScreen')) {
    const items = element.querySelectorAll<HTMLElement>('.VPNavScreenMenuLink, .VPNavScreenMenuGroup, .VPNavScreenAppearance, .VPNavScreenSocialLinks')
    gsap.from(items, { opacity: 0, y: 12, duration: 0.38, stagger: 0.045, ease: 'power2.out', clearProps: 'opacity,transform' })
  }
  if (element.matches('.VPLocalSearchBox')) {
    const shell = element.querySelector<HTMLElement>('.shell')
    if (shell) gsap.from(shell, { opacity: 0, y: 14, scale: 0.98, duration: 0.32, ease: 'power2.out', clearProps: 'opacity,transform' })
  }
}

function observeOverlays() {
  overlayObserver = new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (!(node instanceof Element)) continue
        if (node.matches('#VPNavScreen, .VPLocalSearchBox')) animateOverlay(node)
        node.querySelectorAll('#VPNavScreen, .VPLocalSearchBox').forEach(animateOverlay)
      }
    }
  })
  overlayObserver.observe(document.body, { childList: true, subtree: true })
}

function onNavOpen(event: PointerEvent) {
  if (!motionAllowed()) return
  const target = event.target
  if (!(target instanceof Element)) return
  const flyout = target.closest<HTMLElement>('.VPNavBarMenuGroup')
  if (!flyout || flyout.contains(event.relatedTarget as Node | null)) return
  const items = flyout.querySelectorAll<HTMLElement>('.VPMenu .VPMenuLink, .VPMenu .VPMenuGroup')
  gsap.fromTo(items, { opacity: 0, y: 7 }, {
    opacity: 1, y: 0, duration: 0.25, stagger: 0.035, ease: 'power2.out',
    overwrite: true, clearProps: 'opacity,transform'
  })
}

function setupOutlineMotion(root: HTMLElement) {
  const outline = root.querySelector<HTMLElement>('.VPDocAsideOutline')
  if (!outline) return
  let lastActive: Element | null = null
  const observer = new MutationObserver(() => {
    const active = outline.querySelector<HTMLElement>('.outline-link.active')
    if (!active || active === lastActive) return
    lastActive = active
    gsap.fromTo(active, { x: -4 }, { x: 0, duration: 0.38, ease: 'power2.out', clearProps: 'transform', overwrite: true })
  })
  observer.observe(outline, { attributes: true, attributeFilter: ['class'], subtree: true })
  return () => observer.disconnect()
}

function setupListMotion(root: HTMLElement) {
  const list = root.querySelector('.post-list, .index-post-list')
  if (!list) return
  const observer = new MutationObserver(records => {
    const cards = new Set<HTMLElement>()
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (!(node instanceof HTMLElement)) continue
        if (node.matches('.post-card')) cards.add(node)
        node.querySelectorAll<HTMLElement>('.post-card').forEach(card => cards.add(card))
      }
    }
    if (cards.size) gsap.from([...cards], {
      opacity: 0, y: 16, duration: 0.45, stagger: 0.05,
      ease: 'power2.out', clearProps: 'opacity,transform'
    })
  })
  observer.observe(list, { childList: true, subtree: true })
  return () => observer.disconnect()
}

function revealOnScroll(elements: HTMLElement[]) {
  elements.forEach(element => {
    gsap.from(element, {
      opacity: 0,
      y: 18,
      duration: 0.65,
      ease: 'power2.out',
      clearProps: 'opacity,transform',
      scrollTrigger: {
        trigger: element,
        start: 'top 90%',
        once: true
      }
    })
  })
}

function animatePage(root: HTMLElement) {
  media?.revert()
  media = gsap.matchMedia()
  media.add('(prefers-reduced-motion: no-preference)', () => {
    const cleanupOutline = setupOutlineMotion(root)
    const cleanupList = setupListMotion(root)
    const cleanup = () => { cleanupOutline?.(); cleanupList?.() }
    const home = root.querySelector('.home-layout')
    if (home) {
      const intro: HTMLElement[] = []
      const heading = home.querySelector<HTMLElement>('.list-heading')
      const cards = [...home.querySelectorAll<HTMLElement>('.post-list .post-card')]
      if (heading) intro.push(heading)
      intro.push(...cards.slice(0, 2))
      gsap.from(intro, {
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.09,
        clearProps: 'opacity,transform'
      })
      revealOnScroll(cards.slice(2))
      revealOnScroll([...home.querySelectorAll<HTMLElement>('.home-side > *')])
      return cleanup
    }

    const index = root.querySelector('.index-layout')
    if (index) {
      const intro = [
        index.querySelector<HTMLElement>('.index-header'),
        index.querySelector<HTMLElement>('.index-sidebar .index-panel')
      ].filter((item): item is HTMLElement => Boolean(item))
      gsap.from(intro, { opacity: 0, y: 16, duration: 0.62, stagger: 0.1, ease: 'power2.out', clearProps: 'opacity,transform' })
      const cards = [...index.querySelectorAll<HTMLElement>('.index-post-list .post-card')]
      gsap.from(cards.slice(0, 2), { opacity: 0, y: 18, duration: 0.58, stagger: 0.08, ease: 'power2.out', clearProps: 'opacity,transform' })
      revealOnScroll(cards.slice(2))
      const filters = [...index.querySelectorAll<HTMLElement>('.index-panel button')].slice(0, 12)
      gsap.from(filters, { opacity: 0, x: -8, duration: 0.35, stagger: 0.025, delay: 0.18, ease: 'power2.out', clearProps: 'opacity,transform' })
      return cleanup
    }

    const archives = root.querySelector('.archives-wrapper')
    if (archives) {
      const header = archives.querySelector<HTMLElement>('.archives-header')
      if (header) gsap.from(header, { opacity: 0, y: 16, duration: 0.65, ease: 'power2.out', clearProps: 'opacity,transform' })
      revealOnScroll([...archives.querySelectorAll<HTMLElement>('.year-header, .month-block')])
      return cleanup
    }

    const title = root.querySelector<HTMLElement>('.vp-doc > h1')
    if (title) {
      gsap.from(title, {
        opacity: 0,
        y: 14,
        duration: 0.6,
        ease: 'power2.out',
        clearProps: 'opacity,transform'
      })
    }
    revealOnScroll([...root.querySelectorAll<HTMLElement>(
      '.vp-doc > h2, .vp-doc > h3, .vp-doc > blockquote, .vp-doc > div[class*="language-"]'
    )])
    return cleanup
  }, root)
}

async function scheduleAnimation() {
  const currentVersion = ++version
  window.cancelAnimationFrame(frame)
  media?.revert()
  media = undefined
  await nextTick()
  frame = window.requestAnimationFrame(() => {
    if (currentVersion !== version) return
    const root = document.getElementById('VPContent')
    if (root) animatePage(root)
  })
}

onMounted(() => {
  if (!pluginRegistered) {
    gsap.registerPlugin(ScrollTrigger)
    pluginRegistered = true
  }
  observeOverlays()
  document.addEventListener('pointerover', onNavOpen, { passive: true })
  void scheduleAnimation()
})

watch(() => route.path, () => { void scheduleAnimation() }, { flush: 'post' })

onBeforeUnmount(() => {
  version++
  window.cancelAnimationFrame(frame)
  media?.revert()
  overlayObserver?.disconnect()
  document.removeEventListener('pointerover', onNavOpen)
})
</script>

<template></template>
