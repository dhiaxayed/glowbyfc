"use client"

import Image from "next/image"
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { PRELOAD_CONFIG } from "@/lib/preload-config"

// Utilise directement la configuration centralisée pour éviter la duplication
const galleryImages = [...PRELOAD_CONFIG.galleryPriority, ...PRELOAD_CONFIG.gallerySecondary]

export function InfiniteGalleryOptimized() {
  // Duplicate the images array to create seamless infinite scroll
  const duplicatedImages = useMemo(() => [...galleryImages, ...galleryImages], [])
  const [scrollSpeed, setScrollSpeed] = useState(1)
  const [isInteracting, setIsInteracting] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [connectionSpeed, setConnectionSpeed] = useState<string>('4g')
  const [visibleImages, setVisibleImages] = useState(new Set<number>())
  const [loadedImages, setLoadedImages] = useState(new Set<number>())
  const [rafId, setRafId] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const touchStartRef = useRef({ x: 0, time: 0, velocity: 0 })
  const lastTouchTime = useRef(0)
  const velocityBuffer = useRef<number[]>([])
  const isScrollingRef = useRef(false)

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

  // Intersection Observer mobile-optimisé avec adaptive performance
  useEffect(() => {
    if (!containerRef.current) return

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // Adaptive thresholds based on device and connection
    const getOptimalSettings = () => {
      const isSlowConnection = connectionSpeed === 'slow-2g' || connectionSpeed === '2g'
      const isFastDevice = !isMobile || ((performance as any)?.memory && (performance as any).memory > 4000000000) // 4GB+
      
      return {
        rootMargin: isMobile 
          ? (isSlowConnection ? '25px' : '100px') 
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
              // More aggressive cleanup on desktop, conservative on mobile
              setVisibleImages(prev => {
                const newSet = new Set(prev)
                newSet.delete(index)
                return newSet
              })
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
  }, [isMobile, duplicatedImages.length, connectionSpeed])

  // Image load success callback with performance tracking
  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages(prev => new Set([...prev, index]))
  }, [])

  // Optimized velocity calculation for smooth mobile scrolling
  const calculateVelocity = useCallback((currentX: number, currentTime: number) => {
    const deltaX = Math.abs(touchStartRef.current.x - currentX)
    const deltaTime = currentTime - touchStartRef.current.time
    
    if (deltaTime === 0) return 0
    
    const instantVelocity = deltaX / deltaTime
    
    // Add to velocity buffer for smoothing
    velocityBuffer.current.push(instantVelocity)
    if (velocityBuffer.current.length > 5) { // Keep last 5 measurements
      velocityBuffer.current.shift()
    }
    
    // Calculate smoothed velocity
    const averageVelocity = velocityBuffer.current.reduce((sum, v) => sum + v, 0) / velocityBuffer.current.length
    
    // Mobile-optimized speed calculation with better sensitivity
    const baseSpeed = isMobile ? 0.8 : 1.2
    const maxSpeed = isMobile ? 2.0 : 4.0
    const sensitivity = isMobile ? 0.8 : 1.5
    
    return Math.max(0.5, Math.min(maxSpeed, baseSpeed + averageVelocity * sensitivity))
  }, [isMobile])

  // Throttled scroll speed update using RAF
  const updateScrollSpeed = useCallback((newSpeed: number) => {
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
    
    const updateId = requestAnimationFrame(() => {
      setScrollSpeed(newSpeed)
      setRafId(null)
    })
    
    setRafId(updateId)
  }, [rafId])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsInteracting(true)
    isScrollingRef.current = true
    velocityBuffer.current = [] // Reset velocity buffer
    
    const currentTime = Date.now()
    touchStartRef.current = {
      x: e.touches[0].clientX,
      time: currentTime,
      velocity: 0
    }
    lastTouchTime.current = currentTime
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isInteracting || !isScrollingRef.current) return
    
    const currentTime = Date.now()
    const timeDiff = currentTime - lastTouchTime.current
    
    // Throttle touch move events to 60fps max
    if (timeDiff < 16) return
    
    const currentX = e.touches[0].clientX
    const newSpeed = calculateVelocity(currentX, currentTime)
    
    updateScrollSpeed(newSpeed)
    lastTouchTime.current = currentTime
  }, [isInteracting, calculateVelocity, updateScrollSpeed])

  const handleTouchEnd = useCallback(() => {
    setIsInteracting(false)
    isScrollingRef.current = false
    
    // Smooth deceleration
    const currentSpeed = scrollSpeed
    const decelerationSteps = isMobile ? 8 : 12
    const targetSpeed = 1
    
    let step = 0
    const decelerate = () => {
      step++
      const progress = step / decelerationSteps
      const easedProgress = 1 - Math.pow(1 - progress, 3) // Ease-out cubic
      const newSpeed = currentSpeed + (targetSpeed - currentSpeed) * easedProgress
      
      updateScrollSpeed(newSpeed)
      
      if (step < decelerationSteps && isScrollingRef.current === false) {
        requestAnimationFrame(decelerate)
      }
    }
    
    requestAnimationFrame(decelerate)
  }, [scrollSpeed, isMobile, updateScrollSpeed])

  // Pointer events for desktop with mobile-like behavior
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return // Let touch events handle this
    
    setIsInteracting(true)
    isScrollingRef.current = true
    velocityBuffer.current = []
    
    const currentTime = Date.now()
    touchStartRef.current = {
      x: e.clientX,
      time: currentTime,
      velocity: 0
    }
    lastTouchTime.current = currentTime
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isInteracting || !isScrollingRef.current || e.pointerType === 'touch') return
    
    const currentTime = Date.now()
    const timeDiff = currentTime - lastTouchTime.current
    
    if (timeDiff < 16) return // 60fps throttling
    
    const currentX = e.clientX
    const newSpeed = calculateVelocity(currentX, currentTime)
    
    updateScrollSpeed(newSpeed)
    lastTouchTime.current = currentTime
  }, [isInteracting, calculateVelocity, updateScrollSpeed])

  const handlePointerUp = useCallback(() => {
    if (isScrollingRef.current) {
      handleTouchEnd() // Reuse touch end logic
    }
  }, [handleTouchEnd])

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [rafId])

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-rose-50 via-white to-amber-50 py-4 sm:py-6 md:py-8">
      <div 
        ref={containerRef}
        className="flex space-x-4 sm:space-x-5 md:space-x-5 lg:space-x-6 w-max"
        style={{
          animation: `scroll-infinite ${Math.max(60, 120 / scrollSpeed)}s linear infinite`,
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          transform: 'translate3d(0,0,0)', // Force GPU acceleration
          contain: 'layout style paint', // CSS containment for better performance
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {duplicatedImages.map((image, index) => {
          // Enhanced loading strategy based on Context7 best practices
          const isVisible = visibleImages.has(index)
          const isLoaded = loadedImages.has(index)
          const position = index % galleryImages.length
          
          // Smart priority calculation
          const isCritical = position < (isMobile ? 2 : 4)
          const isPriority = position < (isMobile ? 6 : 12)
          const isInInitialViewport = index < (isMobile ? 4 : 8)
          
          // Connection-aware loading decisions
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
                if (el && observerRef.current && !isVisible) {
                  observerRef.current.observe(el)
                }
              }}
              className="flex-shrink-0 group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              style={{
                transform: 'translate3d(0,0,0)',
                backfaceVisibility: 'hidden',
                contain: 'layout style paint',
                willChange: isVisible ? 'transform' : 'auto' // Only declare will-change when needed
              }}
            >
              {shouldRender ? (
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Glow by FC Collection ${position + 1}`}
                  width={width}
                  height={height}
                  className="w-[200px] h-[280px] sm:w-[220px] sm:h-[310px] md:w-[240px] md:h-[340px] lg:w-[250px] lg:h-[350px] object-cover group-hover:scale-105 transition-transform duration-500"
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
                    objectFit: 'cover'
                  }}
                />
              ) : (
                // Optimized placeholder with reduced complexity
                <div 
                  className="w-[200px] h-[280px] sm:w-[220px] sm:h-[310px] md:w-[240px] md:h-[340px] lg:w-[250px] lg:h-[350px] bg-gradient-to-br from-rose-50 to-pink-50 animate-pulse flex items-center justify-center"
                  style={{
                    backgroundColor: '#f8fafc',
                    contain: 'layout style paint'
                  }}
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
