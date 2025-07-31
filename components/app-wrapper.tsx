"use client"

import React, { useState, useEffect } from "react"
import { LoadingScreen } from "./loading-screen"
import { useAssetLoader } from "@/hooks/use-asset-loader"

interface AppWrapperProps {
  children: React.ReactNode
}

export function AppWrapper({ children }: AppWrapperProps) {
  const [showContent, setShowContent] = useState(false)
  const [isLoadingComplete, setIsLoadingComplete] = useState(false)
  const { isLoading, progress, error, currentPhase } = useAssetLoader({
    minimumLoadTime: 2500, // Minimum 2.5 secondes pour une expérience premium
    timeout: 30000 // Timeout de 30 secondes
  })

  useEffect(() => {
    if (!isLoading || error) {
      // Délai supplémentaire pour l'animation de sortie
      const timer = setTimeout(() => {
        setIsLoadingComplete(true)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [isLoading, error])

  const handleLoadingComplete = () => {
    setShowContent(true)
  }

  // Gestion des erreurs avec fallback élégant
  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-rose-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-6">
          <div className="w-24 h-24 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Oups! Problème de connexion</h2>
            <p className="text-gray-600 mb-4">Certains éléments n'ont pas pu se charger.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-lg font-medium hover:from-rose-500 hover:to-pink-600 transition-all duration-200"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Écran de chargement */}
      {!isLoadingComplete && (
        <LoadingScreen 
          onLoadingComplete={handleLoadingComplete}
          progress={progress}
          currentPhase={currentPhase}
        />
      )}

      {/* Contenu principal avec animation d'entrée */}
      <div 
        className={`transition-all duration-1000 ease-out ${
          showContent 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {isLoadingComplete && children}
      </div>
    </>
  )
}
