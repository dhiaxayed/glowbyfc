"use client"

import { useEffect } from "react"

interface ImagePreloaderProps {
  images: string[]
  priority?: boolean
}

export function ImagePreloader({ images, priority = false }: ImagePreloaderProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const preloadImages = async () => {
      const imagePromises = images.map((src) => {
        return new Promise<void>((resolve, reject) => {
          const img = new window.Image()
          
          const timeout = setTimeout(() => {
            resolve() // Résoudre même en cas de timeout pour ne pas bloquer
          }, 5000)

          img.onload = () => {
            clearTimeout(timeout)
            resolve()
          }

          img.onerror = () => {
            clearTimeout(timeout)
            console.warn(`Failed to preload image: ${src}`)
            resolve() // Continuer même si une image échoue
          }

          img.src = src
        })
      })

      try {
        await Promise.all(imagePromises)
      } catch (error) {
        console.warn("Some images failed to preload:", error)
      }
    }

    if (priority) {
      // Précharger immédiatement pour les images critiques
      preloadImages()
    } else {
      // Délai pour les images non critiques
      const timer = setTimeout(preloadImages, 1000)
      return () => clearTimeout(timer)
    }
  }, [images, priority])

  // Rendu invisible pour forcer le cache du navigateur
  return (
    <div className="preload-hidden" aria-hidden="true">
      {images.map((src, index) => (
        <img
          key={`preload-${index}`}
          src={src}
          alt=""
          width={1}
          height={1}
          loading="eager"
          style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}
        />
      ))}
    </div>
  )
}
