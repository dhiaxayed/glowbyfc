"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"

interface LoadingScreenProps {
  onLoadingComplete: () => void
  progress?: number
  currentPhase?: 'logo' | 'critical' | 'gallery' | 'complete'
}

export function LoadingScreen({ onLoadingComplete, progress: externalProgress, currentPhase }: LoadingScreenProps) {
  const [progress, setProgress] = useState(externalProgress || 0)
  const [isVisible, setIsVisible] = useState(true)

  // Messages selon la phase de chargement
  const getPhaseMessage = (phase?: string) => {
    switch (phase) {
      case 'logo':
        return 'Initialisation'
      case 'critical':
        return 'Chargement'
      case 'gallery':
        return 'Préparation'
      case 'complete':
        return 'Finalisation'
      default:
        return 'Chargement'
    }
  }

  useEffect(() => {
    // Utiliser le progress externe si fourni
    if (externalProgress !== undefined) {
      setProgress(externalProgress)
      
      // Si le chargement externe est terminé, commencer l'animation de sortie
      if (externalProgress >= 100) {
        setTimeout(() => {
          setIsVisible(false)
          setTimeout(onLoadingComplete, 500)
        }, 800)
      }
      return
    }
    // Simuler le chargement des assets avec un feedback progressif
    const loadAssets = async () => {
      const totalAssets = 40 // Nombre total d'images dans la galerie + assets principaux
      let loadedAssets = 0

      // Précharger le logo d'abord pour un affichage immédiat
      const logoImage = new window.Image()
      logoImage.src = "/assets/logo.png"
      
      await new Promise<void>((resolve) => {
        logoImage.onload = () => resolve()
        logoImage.onerror = () => resolve() // Continue même si le logo ne charge pas
      })

      // Précharger les images de la galerie
      const galleryImages = Array.from({ length: 38 }, (_, i) => {
        const extensions = ['.jpeg', '.png']
        const ext = i === 5 || i === 6 || i === 13 || i === 14 || i === 15 || 
                    i === 16 || i === 17 || i === 18 || i === 36 ? '.png' : '.jpeg'
        return `/glow2/${i + 1}${ext}`
      })

      // Autres assets critiques
      const criticalAssets = [
        "/assets/cptr.png",
        "/placeholder.jpg",
        "/placeholder-user.jpg"
      ]

      const allAssets = [...galleryImages, ...criticalAssets]

      // Fonction pour précharger une image avec timeout
      const preloadImage = (src: string): Promise<void> => {
        return new Promise((resolve) => {
          const img = new window.Image()
          
          const handleLoad = () => {
            loadedAssets++
            const newProgress = Math.min((loadedAssets / totalAssets) * 100, 100)
            setProgress(newProgress)
            resolve()
          }

          // Timeout de 3 secondes par image pour éviter le blocage
          const timeout = setTimeout(() => {
            handleLoad()
          }, 3000)

          img.onload = () => {
            clearTimeout(timeout)
            handleLoad()
          }

          img.onerror = () => {
            clearTimeout(timeout)
            handleLoad()
          }

          img.src = src
        })
      }

      // Charger les assets en parallèle avec une limite de concurrence
      const batchSize = 5
      for (let i = 0; i < allAssets.length; i += batchSize) {
        const batch = allAssets.slice(i, i + batchSize)
        await Promise.all(batch.map(preloadImage))
      }

      // Attendre un minimum de 2 secondes pour l'expérience utilisateur
      const minDisplayTime = 2000
      const loadingTime = Date.now() - startTime
      if (loadingTime < minDisplayTime) {
        await new Promise(resolve => setTimeout(resolve, minDisplayTime - loadingTime))
      }

      // Animation de sortie
      setTimeout(() => {
        setIsVisible(false)
        setTimeout(onLoadingComplete, 500) // Attendre la fin de l'animation
      }, 300)
    }

    const startTime = Date.now()
    loadAssets()
  }, [onLoadingComplete, externalProgress])

  if (!isVisible) return null

  return (
    <div className={`fixed inset-0 z-50 bg-white flex items-center justify-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background subtil */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>
      
      <div className="relative z-10 text-center space-y-12">
        {/* Logo professionnel avec animation subtile */}
        <div className="relative">
          {/* Cercle de fond élégant */}
          <div className="absolute inset-0 w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 mx-auto bg-white rounded-full shadow-2xl border border-gray-100"></div>
          
          {/* Effet de rotation subtile */}
          <div className="absolute inset-0 w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 mx-auto rounded-full border-2 border-gray-200 animate-spin" style={{ animationDuration: '8s' }}></div>
          
          {/* Logo centré */}
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 mx-auto flex items-center justify-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 relative">
              <Image
                src="/assets/logo.png"
                alt="Glow by FC"
                fill
                className="object-contain"
                priority
                quality={100}
              />
            </div>
          </div>
        </div>

        {/* Texte de marque moderne et épuré */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-[0.2em] text-gray-900">
            GLOW BY FC
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-light tracking-wide">
            L'élégance redéfinie
          </p>
        </div>

        {/* Barre de progression minimaliste */}
        <div className="w-80 sm:w-96 mx-auto space-y-4">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gray-900 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Indicateur de progression épuré */}
          <div className="flex justify-between items-center text-xs text-gray-400 font-light">
            <span className="tracking-wide">{getPhaseMessage(currentPhase)}</span>
            <span className="font-medium tabular-nums">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Points d'animation minimalistes */}
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.3}s`, animationDuration: '1.5s' }}
            ></div>
          ))}
        </div>
      </div>

      {/* Éléments décoratifs minimalistes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-gray-300 rounded-full opacity-40"
            style={{
              left: `${25 + i * 20}%`,
              top: `${40 + (i % 2) * 20}%`,
              animationDelay: `${i * 1.2}s`,
              animation: 'pulse 3s infinite'
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}
