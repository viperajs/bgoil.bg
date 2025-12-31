"use client"

import { useEffect, useState, useRef } from "react"
import { Sparkles } from "lucide-react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface Firework {
  id: number
  x: number
  y: number
  color: string
  particles: Array<{ x: number; y: number; vx: number; vy: number; color: string; life: number }>
  age: number
}

const TARGET_DATE = new Date('2026-01-01T00:00:00').getTime()
const END_DATE = new Date('2026-01-01T01:00:00').getTime()

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#E74C3C',
  '#FFD700', '#FF1493', '#00CED1', '#FF6347', '#32CD32'
]

export default function NewYearCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)
  const [showFireworks, setShowFireworks] = useState(false)
  const [fireworks, setFireworks] = useState<Firework[]>([])
  const lastFireworkTime = useRef(0)

  // Таймер логика
  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now()
      
      // Проверка дали сме след 01:00 - скриваме всичко
      if (now >= END_DATE) {
        setShowFireworks(false)
        setTimeLeft(null)
        setFireworks([])
        return
      }
      
      // Проверка дали сме между 00:00 и 01:00 на 01.01.2026
      if (now >= TARGET_DATE && now < END_DATE) {
        setShowFireworks(true)
        setTimeLeft(null)
        return
      }
      
      // Обратно броене до 00:00
      const difference = TARGET_DATE - now
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        
        setTimeLeft({ days, hours, minutes, seconds })
        setShowFireworks(false)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  // Фойерверки логика
  useEffect(() => {
    if (!showFireworks) {
      setFireworks([])
      return
    }

    // Създаване на нови фойерверки
    const createFirework = () => {
      const now = Date.now()
      if (now - lastFireworkTime.current < 300) return // Максимум 1 на 300ms
      
      lastFireworkTime.current = now
      
      const newFirework: Firework = {
        id: now + Math.random(),
        x: 20 + Math.random() * 60, // 20% до 80% от екрана
        y: 20 + Math.random() * 40, // 20% до 60% от екрана
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        age: 0,
        particles: Array.from({ length: 50 }, () => {
          const angle = Math.random() * Math.PI * 2
          const speed = 2 + Math.random() * 4
          return {
            x: 0,
            y: 0,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            life: 1
          }
        })
      }
      
      setFireworks(prev => {
        const updated = [...prev, newFirework]
        return updated.slice(-15) // Максимум 15 фойерверки
      })
    }

    // Анимация на фойерверките
    const animate = () => {
      setFireworks(prev => 
        prev.map(fw => ({
          ...fw,
          age: fw.age + 1,
          particles: fw.particles.map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.15, // гравитация
            life: Math.max(0, p.life - 0.02)
          }))
        })).filter(fw => fw.age < 100 && fw.particles.some(p => p.life > 0))
      )
    }

    const createInterval = setInterval(createFirework, 500)
    const animateInterval = setInterval(animate, 16) // ~60fps

    return () => {
      clearInterval(createInterval)
      clearInterval(animateInterval)
    }
  }, [showFireworks])

  // Ако сме след 01:00, не показваме нищо
  if (Date.now() >= END_DATE) {
    return null
  }

  // Показване на фойерверки
  if (showFireworks) {
    return (
      <>
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {fireworks.map(fw => (
            <div
              key={fw.id}
              className="absolute"
              style={{
                left: `${fw.x}%`,
                top: `${fw.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {fw.particles.map((particle, idx) => (
                <div
                  key={idx}
                  className="absolute rounded-full"
                  style={{
                    left: `${particle.x}px`,
                    top: `${particle.y}px`,
                    width: '4px',
                    height: '4px',
                    backgroundColor: particle.color,
                    boxShadow: `0 0 8px ${particle.color}, 0 0 16px ${particle.color}`,
                    opacity: particle.life,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        {/* Празен div за да не се счупи layout-а */}
        <div className="h-0" />
      </>
    )
  }

  // Показване на таймер
  if (timeLeft) {
    return (
      <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 rounded-full border border-primary/40 backdrop-blur-sm shadow-lg animate-fade-in-down">
        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
        <div className="flex items-center space-x-3 text-white">
          {timeLeft.days > 0 && (
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-black">{String(timeLeft.days).padStart(2, '0')}</div>
              <div className="text-xs font-semibold opacity-80">дни</div>
            </div>
          )}
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-black">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="text-xs font-semibold opacity-80">часа</div>
          </div>
          <div className="text-primary text-xl font-bold">:</div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-black">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="text-xs font-semibold opacity-80">мин</div>
          </div>
          <div className="text-primary text-xl font-bold">:</div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-black">{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div className="text-xs font-semibold opacity-80">сек</div>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-primary animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>
    )
  }

  return null
}

