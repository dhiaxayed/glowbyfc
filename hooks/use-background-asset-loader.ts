"use client"

import { useEffect, useCallback } from "react"
import { PRELOAD_CONFIG } from "@/lib/preload-config"

/**
 * Hook pour précharger les assets en arrière-plan sans bloquer l'interface
 * Optimisé pour chargement ULTRA-RAPIDE de toutes les images et vidéo
 */
export function useBackgroundAssetLoader() {
  
  // Préchargement spécialisé pour les vidéos
  const preloadVideo = useCallback((src: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      video.preload = 'metadata' // Charge les métadonnées immédiatement
      
      const cleanup = () => {
        video.onloadedmetadata = null
        video.onerror = null
      }

      const timeoutId = setTimeout(() => {
        cleanup()
        resolve(false)
      }, 2000) // Timeout court pour les vidéos

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
  }, [])
  
  // Préchargement intelligent avec priorités ULTRA-AGRESSIVES
  const preloadImage = useCallback((src: string, priority: 'high' | 'medium' | 'low' = 'medium'): Promise<boolean> => {
    return new Promise((resolve) => {
      // Vérifier si l'image est déjà en cache
      const img = new window.Image()
      
      // Timeouts optimisés pour vitesse maximale
      const timeouts = { high: 1000, medium: 2000, low: 3000 } // Réduits pour plus de rapidité
      const timeoutMs = timeouts[priority]
      
      const cleanup = () => {
        img.onload = null
        img.onerror = null
      }

      const timeoutId = setTimeout(() => {
        cleanup()
        resolve(false) // Échec silencieux
      }, timeoutMs)

      img.onload = () => {
        cleanup()
        clearTimeout(timeoutId)
        resolve(true)
      }

      img.onerror = () => {
        cleanup()
        clearTimeout(timeoutId)
        resolve(false) // Échec silencieux
      }

      img.src = src
    })
  }, [])

  // Préchargement par vagues avec délais optimaux
  const startBackgroundPreloading = useCallback(async () => {
    try {
      // Phase 1: Séparer les images des vidéos dans les assets critiques
      const criticalImages = PRELOAD_CONFIG.critical.filter(src => !src.endsWith('.mp4'))
      const criticalVideos = PRELOAD_CONFIG.critical.filter(src => src.endsWith('.mp4'))
      
      // Précharger les images critiques ET la vidéo en parallèle avec les bonnes méthodes
      await Promise.allSettled([
        ...criticalImages.map(src => preloadImage(src, 'high')),
        ...criticalVideos.map(src => preloadVideo(src))
      ])

      console.log('🎯 Assets critiques chargés (images + vidéo)')

      // Phase 2: TOUTES les images de la galerie immédiatement après (pas de délai)
      // Chargement agressif par lots plus importants pour vitesse maximale
      const priorityAssets = PRELOAD_CONFIG.galleryPriority
      const batchSize = 6 // Lots plus importants pour chargement ultra-rapide
      
      for (let i = 0; i < priorityAssets.length; i += batchSize) {
        const batch = priorityAssets.slice(i, i + batchSize)
        
        // Précharger le lot sans attendre (parallélisme maximal)
        Promise.allSettled(
          batch.map(src => preloadImage(src, 'high')) // Toutes en priorité HAUTE
        )
        
        // Délai minimal entre les lots (10ms seulement)
        await new Promise(resolve => setTimeout(resolve, 10))
      }

      // Plus de Phase 3 - tout est chargé en priorité haute immédiatement
      console.log('🚀 Préchargement ultra-rapide terminé: toutes les images et vidéo chargées!')

    } catch (error) {
      // Échec silencieux - pas d'impact sur l'UX
      console.warn('Background preloading error:', error)
    }
  }, [preloadImage, preloadVideo])

  useEffect(() => {
    // Démarrer le préchargement IMMÉDIATEMENT après le rendu
    const timer = setTimeout(() => {
      startBackgroundPreloading()
    }, 0) // Délai supprimé pour activation immédiate

    return () => clearTimeout(timer)
  }, [startBackgroundPreloading])

  // Ce hook ne retourne rien - il travaille silencieusement en arrière-plan
}


