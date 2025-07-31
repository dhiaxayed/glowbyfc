"use client"

import { useEffect } from "react"

export function PerformanceOptimizer() {
  useEffect(() => {
    // Optimisations pour les performances du navigateur
    if (typeof window !== 'undefined') {
      // Force le garbage collection si disponible (Chrome DevTools)
      if ('gc' in window && typeof (window as any).gc === 'function') {
        const interval = setInterval(() => {
          if (document.hidden) { // Seulement quand l'onglet n'est pas visible
            ;(window as any).gc()
          }
        }, 30000)
        
        return () => clearInterval(interval)
      }

      // Optimisation des animations CSS
      const style = document.createElement('style')
      style.textContent = `
        /* Optimisations CSS pour les performances */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Améliore le rendu des transformations */
        [class*="transform"],
        [class*="translate"],
        [class*="scale"],
        [class*="rotate"] {
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }
        
        /* Optimisation pour les images */
        img {
          transform: translateZ(0);
        }
        
        /* Préférences pour les animations réduites */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `
      document.head.appendChild(style)

      return () => {
        document.head.removeChild(style)
      }
    }
  }, [])

  useEffect(() => {
    // Préchargement stratégique des ressources
    if ('requestIdleCallback' in window) {
      const idleCallback = window.requestIdleCallback(() => {
        // Précharger les polices critiques
        const fontLinks = [
          'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
        ]
        
        fontLinks.forEach(href => {
          const link = document.createElement('link')
          link.rel = 'preload'
          link.as = 'style'
          link.href = href
          link.crossOrigin = 'anonymous'
          document.head.appendChild(link)
        })
      })

      return () => {
        window.cancelIdleCallback(idleCallback)
      }
    }
  }, [])

  useEffect(() => {
    // Gestion intelligente de la mémoire
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Réduire l'activité quand l'onglet n'est pas visible
        document.querySelectorAll('video, audio').forEach(media => {
          if (media instanceof HTMLMediaElement) {
            media.pause()
          }
        })
        
        // Suspendre les animations non critiques
        document.querySelectorAll('[data-pausable]').forEach(element => {
          if (element instanceof HTMLElement) {
            element.style.animationPlayState = 'paused'
          }
        })
      } else {
        // Reprendre l'activité
        document.querySelectorAll('[data-pausable]').forEach(element => {
          if (element instanceof HTMLElement) {
            element.style.animationPlayState = 'running'
          }
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Ce composant ne rend rien visuellement
  return null
}
