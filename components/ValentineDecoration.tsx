'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface Heart {
    id: number
    x: number
    scale: number
    duration: number
    delay: number
}

export function ValentineDecoration() {
    const [hearts, setHearts] = useState<Heart[]>([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const interval = setInterval(() => {
            const newHeart = {
                id: Date.now(),
                x: Math.random() * 100, // percentage
                scale: 0.8 + Math.random() * 1.5,
                duration: 8 + Math.random() * 12,
                delay: 0
            }

            setHearts(prev => [...prev.slice(-25), newHeart]) // Keep max 25 hearts
        }, 800)

        return () => clearInterval(interval)
    }, [])

    if (!mounted) return null

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden" aria-hidden="true">
            <AnimatePresence>
                {hearts.map(heart => (
                    <motion.div
                        key={heart.id}
                        initial={{
                            y: '110vh',
                            x: `${heart.x}vw`,
                            opacity: 0,
                            scale: 0.5
                        }}
                        animate={{
                            y: '-20vh',
                            opacity: [0, 0.8, 0],
                            scale: heart.scale
                        }}
                        transition={{
                            duration: heart.duration,
                            ease: "linear",
                            delay: heart.delay
                        }}
                        className="absolute text-pink-500/60 dark:text-pink-400/60 drop-shadow-md"
                        style={{ willChange: 'transform, opacity' }}
                    >
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                            className="drop-shadow-sm"
                        >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                    </motion.div>
                ))}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-4 right-4 z-[101] bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-pink-500/30 text-pink-500 font-bold text-sm md:text-base shadow-lg cursor-default hover:scale-105 transition-transform"
            >
                Честит Свети Валентин на всички влюбени! ❤️
            </motion.div>
        </div>
    )
}
