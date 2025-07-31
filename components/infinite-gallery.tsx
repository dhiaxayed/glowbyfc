"use client"

import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { PRELOAD_CONFIG } from "@/lib/preload-config"

// Utilise directement la configuration centralisée pour éviter la duplication
const galleryImages = [...PRELOAD_CONFIG.galleryPriority, ...PRELOAD_CONFIG.gallerySecondary]

export function InfiniteGallery() {
  // Duplicate the images array to create seamless infinite scroll
  const duplicatedImages = [...galleryImages, ...galleryImages]
  const [scrollSpeed, setScrollSpeed] = useState(1)
  const [isInteracting, setIsInteracting] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [loadedImages, setLoadedImages] = useState(new Set<number>())
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const touchStartRef = useRef({ x: 0, time: 0 })

  // Détection mobile améliorée
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Intersection Observer pour lazy loading mobile optimisé
  useEffect(() => {
    if (!isMobile) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0')
            setLoadedImages(prev => new Set([...prev, index]))
          }
        })
      },
      {
        rootMargin: isMobile ? '100px' : '300px', // Plus petit buffer sur mobile
        threshold: 0.1
      }
    )

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [isMobile])

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
      // Vitesse de défilement réduite sur mobile pour de meilleures performances
      const velocity = Math.abs(deltaX) / deltaTime
      const maxSpeed = isMobile ? 3 : 5 // Limite plus basse sur mobile
      const newSpeed = Math.max(0.2, Math.min(maxSpeed, 1 + velocity * (isMobile ? 1.5 : 2)))
      setScrollSpeed(newSpeed)
    }
  }

  const handleTouchEnd = () => {
    setIsInteracting(false)
    // Retour à la vitesse normale plus rapide sur mobile
    setTimeout(() => {
      if (!isInteracting) {
        setScrollSpeed(1)
      }
    }, isMobile ? 500 : 1000)
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
      const maxSpeed = isMobile ? 3 : 5
      const newSpeed = Math.max(0.2, Math.min(maxSpeed, 1 + velocity * (isMobile ? 1.5 : 2)))
      setScrollSpeed(newSpeed)
    }
  }

  const handlePointerUp = () => {
    setIsInteracting(false)
    setTimeout(() => {
      if (!isInteracting) {
        setScrollSpeed(1)
      }
    }, isMobile ? 500 : 1000)
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-rose-50 via-white to-amber-50 py-4 sm:py-6 md:py-8">
      <div 
        ref={containerRef}
        className="flex space-x-4 sm:space-x-5 md:space-x-5 lg:space-x-6 w-max"
        style={{
          animation: `scroll-infinite ${120 / scrollSpeed}s linear infinite`,
          // Optimisation mobile : réduction de la complexité d'animation
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          perspective: '1000px'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {duplicatedImages.map((image, index) => {
          // Stratégie de priorité mobile-first
          const isPriority = index < (isMobile ? 6 : PRELOAD_CONFIG.galleryPriority.length) // Moins d'images prioritaires sur mobile
          const isCritical = index < (isMobile ? 2 : 4) // Encore moins d'images critiques sur mobile
          const shouldLoad = !isMobile || loadedImages.has(index) || isCritical
          
          return (
            <div
              key={index}
              data-index={index}
              ref={(el) => {
                if (el && observerRef.current && isMobile && !loadedImages.has(index)) {
                  observerRef.current.observe(el)
                }
              }}
              className="flex-shrink-0 group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              style={{
                // Optimisations mobiles CSS
                transform: 'translate3d(0,0,0)',
                backfaceVisibility: 'hidden'
              }}
            >
              {shouldLoad ? (
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Glow by FC Collection ${(index % galleryImages.length) + 1}`}
                  width={isMobile ? 585 : 1170} // Résolution réduite sur mobile
                  height={isMobile ? 750 : 1500}
                  className="w-[200px] h-[280px] sm:w-[220px] sm:h-[310px] md:w-[240px] md:h-[340px] lg:w-[250px] lg:h-[350px] object-cover group-hover:scale-105 transition-transform duration-500"
                  priority={isCritical}
                  loading={isPriority ? "eager" : "lazy"}
                  quality={isMobile ? (isPriority ? 75 : 60) : (isPriority ? 85 : 75)} // Qualité réduite sur mobile
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyiwwNiAAY5kT3NcOFb7Udqdt/b//Z"
                  sizes={isMobile ? "(max-width: 768px) 200px, 250px" : "(max-width: 768px) 220px, (max-width: 1024px) 240px, 250px"}
                />
              ) : (
                // Placeholder optimisé pour mobile
                <div 
                  className="w-[200px] h-[280px] sm:w-[220px] sm:h-[310px] md:w-[240px] md:h-[340px] lg:w-[250px] lg:h-[350px] bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl animate-pulse"
                  style={{
                    backgroundImage: 'url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyiwwNiAAY5kT3NcOFb7Udqdt/b//Z")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )
        })}
      </div>
    </div>
  )
}