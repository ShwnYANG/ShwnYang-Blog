<template>
  <div class="canvas-background">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
export default {
  name: 'CanvasBackground',
  data() {
    return {
      width: 0,
      height: 0,
      particles: [],
      ctx: null,
      animationFrameId: null
    }
  },
  mounted() {
    this.initCanvas()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    cancelAnimationFrame(this.animationFrameId)
  },
  methods: {
    initCanvas() {
      const canvas = this.$refs.canvas
      this.ctx = canvas.getContext('2d')
      this.handleResize()
      this.createParticles()
      this.animate()
    },
    handleResize() {
      this.width = window.innerWidth
      this.height = window.innerHeight
      this.$refs.canvas.width = this.width
      this.$refs.canvas.height = this.height
    },
    createParticles() {
      this.particles = []
      const particleCount = Math.floor(this.width * this.height / 15000) // Density
      for (let i = 0; i < particleCount; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1
        })
      }
    },
    animate() {
      this.ctx.clearRect(0, 0, this.width, this.height)
      
      // Update and draw particles
      this.particles.forEach((p, index) => {
        p.x += p.vx
        p.y += p.vy

        // Bounce off edges
        if (p.x < 0 || p.x > this.width) p.vx *= -1
        if (p.y < 0 || p.y > this.height) p.vy *= -1

        // Draw particle
        this.ctx.fillStyle = 'rgba(100, 149, 237, 0.5)' // CornflowerBlue
        this.ctx.beginPath()
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        this.ctx.fill()

        // Connect particles
        for (let j = index + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            this.ctx.strokeStyle = `rgba(100, 149, 237, ${0.2 * (1 - distance / 100)})`
            this.ctx.lineWidth = 1
            this.ctx.beginPath()
            this.ctx.moveTo(p.x, p.y)
            this.ctx.lineTo(p2.x, p2.y)
            this.ctx.stroke()
          }
        }
      })

      this.animationFrameId = requestAnimationFrame(this.animate)
    }
  }
}
</script>

<style scoped>
.canvas-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* Behind everything */
  pointer-events: none; /* Don't block clicks */
  overflow: hidden;
}
</style>
