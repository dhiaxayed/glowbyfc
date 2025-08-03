"use client"

import Image from "next/image"
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { PRELOAD_CONFIG } from "@/lib/preload-config"
import { useGalleryOptimization, useOptimizedWillChange } from "@/hooks/use-performance-optimization"

// Utilise directement la configuration centralisée pour éviter la duplication
const galleryImages = [...PRELOAD_CONFIG.galleryPriority, ...PRELOAD_CONFIG.gallerySecondary]

export function InfiniteGallery() {
  // Duplicate the images array to create seamless infinite scroll
  const duplicatedImages = useMemo(() => [...galleryImages, ...galleryImages], [])
  const [isMobile, setIsMobile] = useState(false)
  const [connectionSpeed, setConnectionSpeed] = useState<string>('4g')
  const [visibleImages, setVisibleImages] = useState(new Set<number>())
  const [loadedImages, setLoadedImages] = useState(new Set<number>())
  const [isPaused, setIsPaused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  
  // Context7 optimized hooks
  const { containerRef: galleryContainerRef } = useGalleryOptimization()
  const { elementRef: animationRef, startAnimation, endAnimation } = useOptimizedWillChange()

  // Détection mobile ultra-précise avec connection awareness
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768 || 
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(isMobileDevice)
      
      // Connection speed detection for adaptive loading
      const connection = (navigator as any).connection
      if (connection) {
        const effectiveType = connection.effectiveType || '4g'
        setConnectionSpeed(effectiveType)
      }
      
      return isMobileDevice
    }
    
    checkMobile()
    
    // Throttled resize handler for performance
    let resizeTimer: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(checkMobile, 150)
    }
    
    window.addEventListener('resize', handleResize, { passive: true })
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  // Context7 optimized animation handlers
  useEffect(() => {
    if (containerRef.current) {
      // Combine refs for optimization
      if (galleryContainerRef.current !== containerRef.current) {
        galleryContainerRef.current = containerRef.current
      }
      if (animationRef.current !== containerRef.current) {
        animationRef.current = containerRef.current
      }
      
      // Start animation optimization
      startAnimation()
      
      return () => {
        endAnimation()
      }
    }
  }, [])

  // Handlers pour pause/reprise du défilement sur mobile et desktop
  const handleMouseEnter = useCallback(() => {
    if (!isMobile) {
      setIsPaused(true)
    }
  }, [isMobile])

  const handleMouseLeave = useCallback(() => {
    if (!isMobile) {
      setIsPaused(false)
    }
  }, [isMobile])

  const handleTouchStart = useCallback(() => {
    if (isMobile) {
      setIsPaused(true)
    }
  }, [isMobile])

  const handleTouchEnd = useCallback(() => {
    if (isMobile) {
      // Délai avant de reprendre pour permettre le clic
      setTimeout(() => setIsPaused(false), 2000)
    }
  }, [isMobile])

  const handleClick = useCallback(() => {
    if (isMobile) {
      setIsPaused(prev => !prev)
    }
  }, [isMobile])

  // Intersection Observer mobile-optimisé avec adaptive performance
  useEffect(() => {
    if (!containerRef.current) return

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // FIX: Pré-charger immédiatement les premières images pour éviter le clignotement
    // Match exactly with what CriticalPreloader preloads
    const initialImages = isMobile ? 4 : 6 // Same as CriticalPreloader logic
    const initialSet = new Set<number>()
    for (let i = 0; i < Math.min(initialImages, duplicatedImages.length); i++) {
      initialSet.add(i)
    }
    setVisibleImages(initialSet)

    // Adaptive thresholds based on device and connection
    const getOptimalSettings = () => {
      const isSlowConnection = connectionSpeed === 'slow-2g' || connectionSpeed === '2g'
      const isFastDevice = !isMobile || ((performance as any)?.memory && (performance as any).memory > 4000000000) // 4GB+
      
      return {
        rootMargin: isMobile 
          ? (isSlowConnection ? '50px' : '150px') // Augmenté pour un chargement plus précoce
          : (isSlowConnection ? '75px' : '200px'),
        threshold: isMobile ? [0, 0.1, 0.25] : [0, 0.1, 0.25, 0.5], // Multiple thresholds for smoother loading
        preloadCount: isMobile 
          ? (isSlowConnection ? 1 : 2) 
          : (isSlowConnection ? 2 : 3)
      }
    }

    const settings = getOptimalSettings()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Use requestIdleCallback for non-blocking updates
        const processEntries = () => {
          entries.forEach((entry) => {
            const index = parseInt(entry.target.getAttribute('data-index') || '0')
            
            if (entry.isIntersecting) {
              setVisibleImages(prev => new Set([...prev, index]))
              
              // Smart preloading: only preload adjacent images on fast connections
              if (!connectionSpeed.includes('2g')) {
                const adjacentIndices = [index - 1, index + 1]
                  .concat(isMobile ? [] : [index - 2, index + 2]) // Fewer preloads on mobile
                  .filter(i => i >= 0 && i < duplicatedImages.length)
                
                adjacentIndices.forEach(i => {
                  setVisibleImages(prev => new Set([...prev, i]))
                })
              }
            } else if (!isMobile || entry.intersectionRatio < 0.1) {
              // FIX: Ne jamais enlever les premières images critiques pour éviter le clignotement
              const position = index % galleryImages.length
              const isCriticalImage = position < (isMobile ? 3 : 4)
              
              if (!isCriticalImage) {
                setVisibleImages(prev => {
                  const newSet = new Set(prev)
                  newSet.delete(index)
                  return newSet
                })
              }
            }
          })
        }

        if ('requestIdleCallback' in window) {
          requestIdleCallback(processEntries, { timeout: 100 })
        } else {
          setTimeout(processEntries, 0)
        }
      },
      {
        root: null,
        rootMargin: settings.rootMargin,
        threshold: settings.threshold
      }
    )

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [isMobile, duplicatedImages.length, connectionSpeed, galleryImages.length])

  // Image load success callback with performance tracking
  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages(prev => new Set([...prev, index]))
  }, [])

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-rose-50 via-white to-amber-50 py-4 sm:py-6 md:py-8">
      <div 
        ref={containerRef}
        className="flex space-x-4 sm:space-x-5 md:space-x-5 lg:space-x-6 w-max infinite-gallery-container animate-scroll-infinite"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          // Consistent animation with no delays for smooth speed
          animationDelay: '0s',
          animationFillMode: 'none',
          animationPlayState: isPaused ? 'paused' : 'running'
        }}
      >
        {duplicatedImages.map((image, index) => {
          // Enhanced loading strategy based on Context7 best practices
          const isVisible = visibleImages.has(index)
          const isLoaded = loadedImages.has(index)
          const position = index % galleryImages.length
          
          // FIX: Smart priority calculation - critiques pour les 3 premières en mobile
          const isCritical = position < (isMobile ? 3 : 4)
          const isPriority = position < (isMobile ? 6 : 12)
          const isInInitialViewport = index < (isMobile ? 6 : 8)
          
          // FIX: Connection-aware loading decisions - forcer le chargement des critiques
          const shouldEagerLoad = isCritical || (isInInitialViewport && !connectionSpeed.includes('2g'))
          const shouldRender = isCritical || isVisible || (isPriority && !connectionSpeed.includes('2g'))
          
          // Adaptive image quality based on connection and device
          const getImageQuality = () => {
            if (connectionSpeed === 'slow-2g') return 40
            if (connectionSpeed === '2g') return 50
            if (connectionSpeed === '3g') return isMobile ? 65 : 75
            return isMobile ? (isPriority ? 75 : 65) : (isPriority ? 85 : 75)
          }
          
          // Adaptive image dimensions for performance
          const getImageDimensions = () => {
            const baseWidth = isMobile ? 320 : 600
            const baseHeight = isMobile ? 450 : 840
            
            // Reduce dimensions on slow connections
            if (connectionSpeed.includes('2g')) {
              return { 
                width: Math.floor(baseWidth * 0.8), 
                height: Math.floor(baseHeight * 0.8) 
              }
            }
            
            return { width: baseWidth, height: baseHeight }
          }
          
          const { width, height } = getImageDimensions()
          
          return (
            <div
              key={`${image}-${index}`}
              data-index={index}
              ref={(el) => {
                // FIX: Attacher l'observer même pour les images critiques pour le suivi
                if (el && observerRef.current) {
                  observerRef.current.observe(el)
                }
              }}
              className={`gallery-item flex-shrink-0 group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                isCritical ? 'gallery-first-images' : ''
              } ${isVisible ? 'will-animate' : ''} ${isMobile ? 'cursor-pointer' : ''}`}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onClick={handleClick}
            >
              {shouldRender ? (
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Glow by FC Collection ${position + 1}`}
                  width={width}
                  height={height}
                  className="gallery-image w-[200px] h-[280px] sm:w-[220px] sm:h-[310px] md:w-[240px] md:h-[340px] lg:w-[250px] lg:h-[350px] object-cover group-hover:scale-105 transition-transform duration-500"
                  priority={shouldEagerLoad}
                  loading={shouldEagerLoad ? "eager" : "lazy"}
                  quality={getImageQuality()}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyiwwNiAAY5kT3NcOFb7Udqdt/b//Z"
                  sizes={isMobile 
                    ? "(max-width: 640px) 200px, 220px" 
                    : "(max-width: 768px) 220px, (max-width: 1024px) 240px, 250px"
                  }
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageLoad(index)} // Mark as "loaded" even on error
                  style={{
                    backgroundColor: '#f8fafc',
                    objectFit: 'cover',
                    // FIX: Stabiliser les premières images pour éviter le clignotement
                    opacity: isCritical ? 1 : (isLoaded ? 1 : 0),
                    transition: isCritical ? 'none' : 'opacity 0.3s ease-in-out'
                  }}
                />
              ) : (
                // Optimized placeholder with reduced complexity
                <div 
                  className="loading-placeholder w-[200px] h-[280px] sm:w-[220px] sm:h-[310px] md:w-[240px] md:h-[340px] lg:w-[250px] lg:h-[350px] bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center"
                >
                  <div className="w-6 h-6 border-2 border-rose-200 border-t-rose-400 rounded-full animate-spin opacity-30" />
                </div>
              )}
              
              {/* Overlay only on loaded images for performance */}
              {isLoaded && (
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ contain: 'layout style paint' }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
