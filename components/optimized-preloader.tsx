"use client"

import React from "react"
import Image from "next/image"
import { PRELOAD_CONFIG } from "@/lib/preload-config"

/**
 * Composant de préchargement optimisé pour Next.js
 * Utilise les techniques natives de Next.js pour un préchargement efficace
 */
export function CriticalImagePreloader() {
  React.useEffect(() => {
    // Précharger les vidéos critiques depuis la configuration mise à jour
    const criticalVideos = PRELOAD_CONFIG.critical.filter(src => src.endsWith('.mp4'))
    
    criticalVideos.forEach((videoSrc) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.muted = true
      video.style.position = 'absolute'
      video.style.top = '-9999px'
      video.style.left = '-9999px'
      video.style.width = '1px'
      video.style.height = '1px'
      video.style.opacity = '0'
      
      video.addEventListener('loadedmetadata', () => {
        console.debug(`Critical video preloaded: ${videoSrc}`)
        if (document.body.contains(video)) {
          document.body.removeChild(video)
        }
      })
      
      video.addEventListener('error', () => {
        console.warn(`Failed to preload critical video: ${videoSrc}`)
        if (document.body.contains(video)) {
          document.body.removeChild(video)
        }
      })
      
      video.src = videoSrc
      document.body.appendChild(video)
    })
  }, [])

  return (
    <>
      {/* Préchargement des images critiques SEULEMENT (pas les vidéos) avec priority */}
      {PRELOAD_CONFIG.critical
        .filter(src => !src.endsWith('.mp4')) // Filtrer les vidéos
        .map((src, index) => (
        <Image
          key={`critical-${index}`}
          src={src}
          alt=""
          width={1}
          height={1}
          priority={true}
          style={{
            position: 'absolute',
            top: '-9999px',
            left: '-9999px',
            opacity: 0,
            pointerEvents: 'none',
            width: '1px',
            height: '1px'
          }}
          onLoad={() => {
            // Image préchargée avec succès
            console.debug(`Critical asset preloaded: ${src}`)
          }}
          onError={() => {
            // Échec silencieux
            console.warn(`Failed to preload critical asset: ${src}`)
          }}
        />
      ))}
      
      {/* Préchargement des images prioritaires sans priority */}
      {PRELOAD_CONFIG.galleryPriority.slice(0, 4).map((src, index) => (
        <Image
          key={`priority-${index}`}
          src={src}
          alt=""
          width={1}
          height={1}
          priority={false}
          loading="eager"
          style={{
            position: 'absolute',
            top: '-9999px',
            left: '-9999px',
            opacity: 0,
            pointerEvents: 'none',
            width: '1px',
            height: '1px'
          }}
          onLoad={() => {
            console.debug(`Priority asset preloaded: ${src}`)
          }}
          onError={() => {
            console.warn(`Failed to preload priority asset: ${src}`)
          }}
        />
      ))}
    </>
  )
}


