"use client"

import { useEffect, useRef } from "react"

export function WaveAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let time = 0

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Particle system for wave layers
    const particles: Array<{
      x: number
      y: number
      baseY: number
      amplitude: number
      frequency: number
      phase: number
      opacity: number
      size: number
      speed: number
      layer: number
    }> = []

    // Create particles for two wave layers
    const createParticles = () => {
      particles.length = 0
      const particleCount = Math.floor((canvas.width * canvas.height) / 6000)

      for (let i = 0; i < particleCount; i++) {
        const layer = i < particleCount / 2 ? 1 : 2
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          baseY: Math.random() * canvas.height,
          amplitude: layer === 1 ? 30 + Math.random() * 50 : 20 + Math.random() * 30,
          frequency: layer === 1 ? 0.008 + Math.random() * 0.012 : 0.006 + Math.random() * 0.008,
          phase: Math.random() * Math.PI * 2,
          opacity: layer === 1 ? 0.15 + Math.random() * 0.25 : 0.1 + Math.random() * 0.2,
          size: layer === 1 ? 1.5 + Math.random() * 2.5 : 1 + Math.random() * 2,
          speed: layer === 1 ? 0.3 + Math.random() * 0.4 : 0.2 + Math.random() * 0.3,
          layer,
        })
      }
    }

    createParticles()

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create dynamic gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      const timeOffset = Math.sin(time * 0.001) * 0.1
      gradient.addColorStop(0, `rgba(2, 20, 85, ${0.08 + timeOffset})`)
      gradient.addColorStop(0.3, `rgba(18, 185, 154, ${0.04 + timeOffset * 0.5})`)
      gradient.addColorStop(0.7, `rgba(239, 89, 9, ${0.06 + timeOffset * 0.3})`)
      gradient.addColorStop(1, `rgba(2, 20, 85, ${0.05 + timeOffset * 0.2})`)

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Animate particles in wave patterns
      particles.forEach((particle, index) => {
        // Calculate wave motion
        const waveY = Math.sin(time * 0.01 + particle.x * particle.frequency + particle.phase) * particle.amplitude
        const secondaryWave =
          Math.sin(time * 0.007 + particle.x * particle.frequency * 1.3 + particle.phase + Math.PI / 3) *
          (particle.amplitude * 0.3)

        particle.y = particle.baseY + waveY + secondaryWave

        // Forward movement with perspective effect
        particle.x += particle.speed * (1 + (particle.y / canvas.height) * 0.5)

        // Reset particle position when it goes off screen
        if (particle.x > canvas.width + 20) {
          particle.x = -20
          particle.baseY = Math.random() * canvas.height
        }

        // Draw particle with glow effect
        const glowSize = particle.size * 3

        // Outer glow
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2)
        const glowGradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, glowSize)

        if (particle.layer === 1) {
          glowGradient.addColorStop(0, `rgba(18, 185, 154, ${particle.opacity * 0.3})`)
          glowGradient.addColorStop(0.5, `rgba(18, 185, 154, ${particle.opacity * 0.1})`)
          glowGradient.addColorStop(1, `rgba(18, 185, 154, 0)`)
        } else {
          glowGradient.addColorStop(0, `rgba(2, 20, 85, ${particle.opacity * 0.4})`)
          glowGradient.addColorStop(0.5, `rgba(2, 20, 85, ${particle.opacity * 0.15})`)
          glowGradient.addColorStop(1, `rgba(2, 20, 85, 0)`)
        }

        ctx.fillStyle = glowGradient
        ctx.fill()

        // Core particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle =
          particle.layer === 1 ? `rgba(18, 185, 154, ${particle.opacity})` : `rgba(2, 20, 85, ${particle.opacity})`
        ctx.fill()
      })

      // Add connecting lines between nearby particles for network effect
      particles.forEach((particle, i) => {
        particles.slice(i + 1, i + 8).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120 && particle.layer === otherParticle.layer) {
            const opacity = (1 - distance / 120) * 0.1
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle =
              particle.layer === 1 ? `rgba(18, 185, 154, ${opacity})` : `rgba(2, 20, 85, ${opacity * 0.8})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      // Add floating energy orbs
      const orbCount = 3
      for (let i = 0; i < orbCount; i++) {
        const orbX = canvas.width * 0.2 + Math.sin(time * 0.003 + i * 2) * (canvas.width * 0.6)
        const orbY = canvas.height * 0.3 + Math.cos(time * 0.004 + i * 1.5) * (canvas.height * 0.4)
        const orbSize = 8 + Math.sin(time * 0.005 + i) * 4

        // Orb glow
        const orbGradient = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, orbSize * 4)
        orbGradient.addColorStop(0, `rgba(239, 89, 9, 0.3)`)
        orbGradient.addColorStop(0.3, `rgba(239, 89, 9, 0.1)`)
        orbGradient.addColorStop(1, `rgba(239, 89, 9, 0)`)

        ctx.beginPath()
        ctx.arc(orbX, orbY, orbSize * 4, 0, Math.PI * 2)
        ctx.fillStyle = orbGradient
        ctx.fill()

        // Orb core
        ctx.beginPath()
        ctx.arc(orbX, orbY, orbSize, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(239, 89, 9, 0.6)`
        ctx.fill()
      }

      time += 1
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />
}
