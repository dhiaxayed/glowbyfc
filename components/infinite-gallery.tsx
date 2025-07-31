"use client"

import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { ImagePreloader } from "./image-preloader"
import { PRELOAD_CONFIG } from "@/lib/preload-config"

// Utilise directement la configuration centralisée pour éviter la duplication
const galleryImages = [...PRELOAD_CONFIG.galleryPriority, ...PRELOAD_CONFIG.gallerySecondary]

export function InfiniteGallery() {
  // Duplicate the images array to create seamless infinite scroll
  const duplicatedImages = [...galleryImages, ...galleryImages]
  const [scrollSpeed, setScrollSpeed] = useState(1)
  const [isInteracting, setIsInteracting] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartRef = useRef({ x: 0, time: 0 })

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsInteracting(true)
    touchStartRef.current = {
      x: e.touches[0].clientX,
      time: Date.now()
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isInteracting) return
    
    const currentX = e.touches[0].clientX
    const deltaX = touchStartRef.current.x - currentX
    const deltaTime = Date.now() - touchStartRef.current.time
    
    if (deltaTime > 0) {
      // Calculate swipe velocity and adjust scroll speed
      const velocity = Math.abs(deltaX) / deltaTime
      const newSpeed = Math.max(0.2, Math.min(5, 1 + velocity * 2))
      setScrollSpeed(newSpeed)
    }
  }

  const handleTouchEnd = () => {
    setIsInteracting(false)
    // Gradually return to normal speed
    setTimeout(() => {
      if (!isInteracting) {
        setScrollSpeed(1)
      }
    }, 1000)
  }

  // Handle pointer events for better cross-device support
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsInteracting(true)
    touchStartRef.current = {
      x: e.clientX,
      time: Date.now()
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isInteracting) return
    
    const currentX = e.clientX
    const deltaX = touchStartRef.current.x - currentX
    const deltaTime = Date.now() - touchStartRef.current.time
    
    if (deltaTime > 0) {
      const velocity = Math.abs(deltaX) / deltaTime
      const newSpeed = Math.max(0.2, Math.min(5, 1 + velocity * 2))
      setScrollSpeed(newSpeed)
    }
  }

  const handlePointerUp = () => {
    setIsInteracting(false)
    setTimeout(() => {
      if (!isInteracting) {
        setScrollSpeed(1)
      }
    }, 1000)
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-rose-50 via-white to-amber-50 py-4 sm:py-6 md:py-8">
      {/* Preloader avec priorités optimisées */}
      <ImagePreloader images={PRELOAD_CONFIG.galleryPriority} priority={true} />
      <ImagePreloader images={PRELOAD_CONFIG.gallerySecondary} priority={false} />
      
      <div 
        ref={containerRef}
        className="flex space-x-4 sm:space-x-5 md:space-x-5 lg:space-x-6 w-max"
        style={{
          animation: `scroll-infinite ${120 / scrollSpeed}s linear infinite`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {duplicatedImages.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Glow by FC Collection ${(index % galleryImages.length) + 1}`}
              width={1170}
              height={1500}
              className="w-[200px] h-[280px] sm:w-[220px] sm:h-[310px] md:w-[240px] md:h-[340px] lg:w-[250px] lg:h-[350px] object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>
    </div>
  )
}