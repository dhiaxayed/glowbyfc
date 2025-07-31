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
  
  // Préchargement spécialisé pour les vidéos (mobile optimisé)
  const preloadVideo = useCallback((src: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      video.preload = isMobile ? 'metadata' : 'auto' // Metadata seulement sur mobile
      video.muted = true
      video.playsInline = true
      
      // Attributs spécifiques mobile pour autoplay
      if (isMobile) {
        video.setAttribute('webkit-playsinline', 'true')
        video.setAttribute('x5-playsinline', 'true')
        video.setAttribute('x5-video-player-type', 'h5')
      }
      
      const cleanup = () => {
        video.onloadedmetadata = null
        video.onerror = null
      }

      const timeoutId = setTimeout(() => {
        cleanup()
        resolve(false)
      }, isMobile ? 3000 : 2000) // Timeout plus long sur mobile

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
  
  // Préchargement intelligent avec priorités mobiles
  const preloadImage = useCallback((src: string, priority: 'high' | 'medium' | 'low' = 'medium'): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new window.Image()
      
      // Timeouts ajustés pour mobile
      const timeouts = isMobile 
        ? { high: 2000, medium: 3000, low: 4000 } // Plus généreux sur mobile
        : { high: 1000, medium: 2000, low: 3000 }
      const timeoutMs = timeouts[priority]
      
      // Optimisations mobiles
      if (isMobile) {
        img.loading = 'lazy'
        img.decoding = 'async'
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

  // Préchargement par vagues avec optimisations mobiles
  const startBackgroundPreloading = useCallback(async () => {
    try {
      // Phase 1: Assets critiques (réduits sur mobile)
      const criticalImages = PRELOAD_CONFIG.critical.filter(src => !src.endsWith('.mp4'))
      const criticalVideos = PRELOAD_CONFIG.critical.filter(src => src.endsWith('.mp4'))
      
      await Promise.allSettled([
        ...criticalImages.slice(0, isMobile ? 2 : 4).map(src => preloadImage(src, 'high')), // Moins d'images sur mobile
        ...criticalVideos.map(src => preloadVideo(src))
      ])

      console.log(`🎯 Assets critiques chargés (mobile: ${isMobile})`)

      // Phase 2: Galerie avec stratégie mobile
      const priorityAssets = PRELOAD_CONFIG.galleryPriority
      const batchSize = isMobile ? 3 : 6 // Lots plus petits sur mobile
      const delay = isMobile ? 25 : 10 // Délais plus longs sur mobile
      
      const assetsToLoad = isMobile 
        ? priorityAssets.slice(0, 12) // Limite sur mobile
        : priorityAssets
      
      for (let i = 0; i < assetsToLoad.length; i += batchSize) {
        const batch = assetsToLoad.slice(i, i + batchSize)
        
        Promise.allSettled(
          batch.map(src => preloadImage(src, 'high'))
        )
        
        await new Promise(resolve => setTimeout(resolve, delay))
      }

      // Phase 3: Secondaires (seulement sur desktop ou connexion rapide)
      if (!isMobile || (navigator as any).connection?.effectiveType === '4g') {
        const secondaryAssets = PRELOAD_CONFIG.gallerySecondary.slice(0, isMobile ? 8 : 16)
        
        for (let i = 0; i < secondaryAssets.length; i += batchSize) {
          const batch = secondaryAssets.slice(i, i + batchSize)
          
          Promise.allSettled(
            batch.map(src => preloadImage(src, 'medium'))
          )
          
          await new Promise(resolve => setTimeout(resolve, isMobile ? 50 : 25))
        }
      }

      console.log(`🚀 Préchargement mobile-optimisé terminé (mobile: ${isMobile})`)

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


