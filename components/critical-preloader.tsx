"use client"

import { useEffect } from "react"
import { PRELOAD_CONFIG } from "@/lib/preload-config"

/**
 * Composant pour préchargement critique ultra-rapide via HTML <link rel="preload">
 * À utiliser dans le layout pour chargement immédiat dès le parsing HTML
 */
export function CriticalPreloader() {
  useEffect(() => {
    // Créer des balises <link rel="preload"> pour chargement immédiat
    const createPreloadLink = (href: string, as: string) => {
      // Vérifier si le lien n'existe pas déjà
      if (document.querySelector(`link[rel="preload"][href="${href}"]`)) return

      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = href
      link.as = as
      
      // Add fetchpriority for critical assets
      if (as === 'image') {
        link.setAttribute('fetchpriority', 'high')
        link.type = href.endsWith('.png') ? 'image/png' : 'image/jpeg'
      } else if (as === 'video') {
        link.type = 'video/mp4'
        link.setAttribute('fetchpriority', 'high')
      }
      
      // Add error handling to prevent preload warnings
      link.onerror = () => {
        console.warn(`Failed to preload: ${href}`)
        link.remove()
      }
      
      document.head.appendChild(link)
    }

    // Séparer les images des vidéos dans les assets critiques
    const criticalImages = PRELOAD_CONFIG.critical.filter(src => !src.endsWith('.mp4'))
    const criticalVideos = PRELOAD_CONFIG.critical.filter(src => src.endsWith('.mp4'))

    // Précharger les images critiques via HTML preload
    criticalImages.forEach(src => {
      createPreloadLink(src, 'image')
    })

    // Précharger les vidéos critiques via HTML preload
    criticalVideos.forEach(src => {
      createPreloadLink(src, 'video')
    })

    // Check if gallery section should be preloaded based on connection
    const shouldPreloadGallery = () => {
      // Only preload gallery images if we're on a reasonably fast connection
      const connection = (navigator as any).connection
      if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
        return false
      }
      return true
    }

    // Précharger aussi les premières images de la galerie via HTML preload
    // Only preload images that will be immediately visible (reduce from 12 to 6 for mobile compatibility)
    if (shouldPreloadGallery()) {
      const initialGalleryImages = window.innerWidth <= 768 ? 4 : 6
      
      // Delay gallery preloading slightly to avoid blocking critical assets
      setTimeout(() => {
        PRELOAD_CONFIG.galleryPriority.slice(0, initialGalleryImages).forEach(src => {
          createPreloadLink(src, 'image')
        })
      }, 100) // Small delay to let critical assets load first
    }

    console.log('⚡ Préchargement HTML critique activé')
  }, [])

  return null // Composant invisible
}
