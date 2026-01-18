"use client"

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface AntigravityProps {
  color?: string
}

function ParticleField({ color = "#fa0000" }: { color: string }) {
  const pointsRef = useRef<THREE.Points>(null)

  const particlesCount = 1000

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3)
    const colors = new Float32Array(particlesCount * 3)
    const colorObj = new THREE.Color(color)

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3

      // Random position in a sphere
      positions[i3] = (Math.random() - 0.5) * 10
      positions[i3 + 1] = (Math.random() - 0.5) * 10
      positions[i3 + 2] = (Math.random() - 0.5) * 10

      // Color with some variation
      colors[i3] = colorObj.r + (Math.random() - 0.5) * 0.2
      colors[i3 + 1] = colorObj.g + (Math.random() - 0.5) * 0.2
      colors[i3 + 2] = colorObj.b + (Math.random() - 0.5) * 0.2
    }

    return { positions, colors }
  }, [color])

  useFrame((state) => {
    if (!pointsRef.current) return

    const time = state.clock.getElapsedTime()

    // Rotate the entire particle field
    pointsRef.current.rotation.y = time * 0.05
    pointsRef.current.rotation.x = time * 0.02

    // Animate individual particles
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3

      // Create a flowing, antigravity effect
      const x = positions[i3]
      const y = positions[i3 + 1]
      const z = positions[i3 + 2]

      positions[i3 + 1] = y + Math.sin(time + x * 0.5) * 0.002
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particlesCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function Antigravity({ color = "#fa0000" }: AntigravityProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.5} />
      <ParticleField color={color} />
    </Canvas>
  )
}
