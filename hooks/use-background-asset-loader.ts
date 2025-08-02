"use client"

import { useEffect, useCallback, useState } from "react"
import { PRELOAD_CONFIG } from "@/lib/preload-config"

/**
 * Hook pour précharger les assets en arrière-plan sans bloquer l'interface
 * Optimisé pour chargement ULTRA-RAPIDE mobile-first
 */
export function useBackgroundAssetLoader() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Détection mobile améliorée
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(mobile)
      return mobile
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Préchargement spécialisé pour les vidéos (mobile optimisé avec Context7 patterns)
  const preloadVideo = useCallback((src: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      
      // Mobile-optimized video settings
      video.preload = isMobile ? 'none' : 'metadata' // Even more conservative on mobile
      video.muted = true
      video.playsInline = true
      
      // Modern mobile video attributes
      if (isMobile) {
        video.setAttribute('webkit-playsinline', 'true')
        video.setAttribute('x5-playsinline', 'true')
        video.setAttribute('x5-video-player-type', 'h5')
        video.setAttribute('x5-video-orientation', 'portraint')
        video.disablePictureInPicture = true
      }
      
      const cleanup = () => {
        video.onloadedmetadata = null
        video.onerror = null
        video.oncanplaythrough = null
      }

      // More generous timeout for mobile networks
      const timeoutId = setTimeout(() => {
        cleanup()
        resolve(false)
      }, isMobile ? 5000 : 3000)

      // Use canplaythrough for better mobile support
      video.oncanplaythrough = () => {
        cleanup()
        clearTimeout(timeoutId)
        resolve(true)
      }

      video.onloadedmetadata = () => {
        cleanup()
        clearTimeout(timeoutId)
        resolve(true)
      }

      video.onerror = () => {
        cleanup()
        clearTimeout(timeoutId)
        resolve(false)
      }

      video.src = src
    })
  }, [isMobile])
  
  // Préchargement intelligent avec priorités mobiles et détection de connexion
  const preloadImage = useCallback((src: string, priority: 'high' | 'medium' | 'low' = 'medium'): Promise<boolean> => {
    return new Promise((resolve) => {
      // Check if image is already loaded or in cache
      const img = new window.Image()
      
      // Connection-aware timeout adjustment
      const connection = (navigator as any).connection
      const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')
      
      const timeouts = isMobile 
        ? { high: isSlowConnection ? 4000 : 2500, medium: isSlowConnection ? 6000 : 4000, low: isSlowConnection ? 8000 : 5000 }
        : { high: isSlowConnection ? 2000 : 1000, medium: isSlowConnection ? 4000 : 2000, low: isSlowConnection ? 6000 : 3000 }
      const timeoutMs = timeouts[priority]
      
      // Modern mobile image optimizations
      if (isMobile) {
        img.loading = 'lazy'
        img.decoding = 'async'
        // Add crossOrigin for better caching
        img.crossOrigin = 'anonymous'
      }
      
      const cleanup = () => {
        img.onload = null
        img.onerror = null
      }

      const timeoutId = setTimeout(() => {
        cleanup()
        resolve(false)
      }, timeoutMs)

      img.onload = () => {
        cleanup()
        clearTimeout(timeoutId)
        resolve(true)
      }

      img.onerror = () => {
        cleanup()
        clearTimeout(timeoutId)
        resolve(false)
      }

      img.src = src
    })
  }, [isMobile])

  // Préchargement par vagues avec optimisations mobiles et adaptive loading
  const startBackgroundPreloading = useCallback(async () => {
    try {
      // Connection and device capability detection
      const connection = (navigator as any).connection
      const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')
      const isFastConnection = connection && connection.effectiveType === '4g'
      const deviceMemory = (navigator as any).deviceMemory || 4 // Default to 4GB
      
      // Skip heavy preloading on very slow connections or low-memory devices
      if (isSlowConnection || deviceMemory < 2) {
        console.log('🚫 Skipping heavy preloading due to slow connection or low memory')
        return
      }

      // Phase 1: Assets critiques (adaptatifs selon les capacités)
      const criticalImages = PRELOAD_CONFIG.critical.filter(src => !src.endsWith('.mp4'))
      const criticalVideos = PRELOAD_CONFIG.critical.filter(src => src.endsWith('.mp4'))
      
      const criticalImageCount = isMobile ? (isSlowConnection ? 1 : 2) : (isSlowConnection ? 2 : 4)
      
      await Promise.allSettled([
        ...criticalImages.slice(0, criticalImageCount).map(src => preloadImage(src, 'high')),
        // Only preload videos on fast connections
        ...(isFastConnection ? criticalVideos.map(src => preloadVideo(src)) : [])
      ])

      console.log(`🎯 Assets critiques chargés (mobile: ${isMobile}, slow: ${isSlowConnection})`)

      // Phase 2: Galerie avec stratégie adaptive ultra-mobile
      const priorityAssets = PRELOAD_CONFIG.galleryPriority
      const batchSize = isMobile ? (isSlowConnection ? 1 : 2) : (isSlowConnection ? 3 : 5)
      const delay = isMobile ? (isSlowConnection ? 100 : 50) : (isSlowConnection ? 50 : 20)
      
      // Limit assets based on connection and device capability
      let assetsToLoad = priorityAssets
      if (isMobile) {
        assetsToLoad = isSlowConnection ? priorityAssets.slice(0, 6) : priorityAssets.slice(0, 15)
      } else if (isSlowConnection) {
        assetsToLoad = priorityAssets.slice(0, 20)
      }
      
      // Use requestIdleCallback for non-blocking preloading
      for (let i = 0; i < assetsToLoad.length; i += batchSize) {
        const batch = assetsToLoad.slice(i, i + batchSize)
        
        if ('requestIdleCallback' in window) {
          await new Promise<void>((resolve) => {
            requestIdleCallback(() => {
              Promise.allSettled(
                batch.map(src => preloadImage(src, 'high'))
              ).then(() => resolve())
            }, { timeout: 1000 })
          })
        } else {
          Promise.allSettled(
            batch.map(src => preloadImage(src, 'high'))
          )
        }
        
        await new Promise(resolve => setTimeout(resolve, delay))
        
        // Stop if connection becomes slow
        const currentConnection = (navigator as any).connection
        if (currentConnection && currentConnection.effectiveType === 'slow-2g') {
          console.log('🛑 Stopping preload due to connection degradation')
          break
        }
      }

      // Phase 3: Secondaires (seulement sur desktop ET connexion rapide ET mémoire suffisante)
      if (!isMobile && isFastConnection && deviceMemory >= 4) {
        const secondaryAssets = PRELOAD_CONFIG.gallerySecondary.slice(0, 12)
        
        for (let i = 0; i < secondaryAssets.length; i += batchSize) {
          const batch = secondaryAssets.slice(i, i + batchSize)
          
          if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
              Promise.allSettled(
                batch.map(src => preloadImage(src, 'medium'))
              )
            }, { timeout: 2000 })
          }
          
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }

      console.log(`🚀 Préchargement adaptatif terminé (mobile: ${isMobile}, slow: ${isSlowConnection}, memory: ${deviceMemory}GB)`)

    } catch (error) {
      console.warn('Background preloading error:', error)
    }
  }, [preloadImage, preloadVideo, isMobile])

  useEffect(() => {
    if (isMobile !== undefined) { // Attendre la détection mobile
      const timer = setTimeout(() => {
        startBackgroundPreloading()
      }, 0)

      return () => clearTimeout(timer)
    }
  }, [startBackgroundPreloading, isMobile])

  // Ce hook ne retourne rien - il travaille silencieusement en arrière-plan
}


