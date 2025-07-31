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
      if (document.querySelector(`link[href="${href}"]`)) return

      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = href
      link.as = as
      
      if (as === 'image') {
        link.type = href.endsWith('.png') ? 'image/png' : 'image/jpeg'
      } else if (as === 'video') {
        link.type = 'video/mp4'
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

    // Précharger aussi les premières images de la galerie via HTML preload
    PRELOAD_CONFIG.galleryPriority.slice(0, 12).forEach(src => {
      createPreloadLink(src, 'image')
    })

    console.log('⚡ Préchargement HTML critique activé')
  }, [])

  return null // Composant invisible
}
