"use client"

import React, { useEffect } from "react"
import { PRELOAD_CONFIG } from "@/lib/preload-config"

/**
 * Composant pour précharger les vidéos en arrière-plan
 * Utilise les meilleures pratiques pour éviter de bloquer l'interface
 */
export function VideoPreloader() {
  useEffect(() => {
    // Récupérer les vidéos depuis les assets critiques
    const videoAssets = PRELOAD_CONFIG.critical.filter(src => src.endsWith('.mp4'))
    
    if (videoAssets.length === 0) return // Pas de vidéos à précharger

    // Précharger les vidéos seulement quand le navigateur est idle
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        videoAssets.forEach((videoSrc) => {
          // Créer un élément video invisible pour déclencher le préchargement
          const video = document.createElement('video')
          video.preload = 'metadata' // Charger seulement les métadonnées
          video.muted = true
          video.style.position = 'absolute'
          video.style.top = '-9999px'
          video.style.left = '-9999px'
          video.style.width = '1px'
          video.style.height = '1px'
          video.style.opacity = '0'
          video.style.pointerEvents = 'none'
          
          video.addEventListener('loadedmetadata', () => {
            console.debug(`Video metadata preloaded: ${videoSrc}`)
            // Nettoyer après le préchargement des métadonnées
            setTimeout(() => {
              if (video.parentNode) {
                video.parentNode.removeChild(video)
              }
            }, 1000)
          })
          
          video.addEventListener('error', () => {
            console.warn(`Failed to preload video: ${videoSrc}`)
            if (video.parentNode) {
              video.parentNode.removeChild(video)
            }
          })
          
          video.src = videoSrc
          document.body.appendChild(video)
        })
      })
    } else {
      // Fallback pour navigateurs plus anciens - différer le préchargement
      setTimeout(() => {
        videoAssets.forEach((videoSrc) => {
          const link = document.createElement('link')
          link.rel = 'preload'
          link.as = 'video'
          link.href = videoSrc
          document.head.appendChild(link)
          
          // Nettoyer après un délai
          setTimeout(() => {
            if (link.parentNode) {
              link.parentNode.removeChild(link)
            }
          }, 10000)
        })
      }, 3000)
    }
  }, [])

  return null // Composant invisible
}


