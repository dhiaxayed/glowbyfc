"use client"

import { useState, useEffect, useCallback } from "react"
import { PRELOAD_CONFIG, getAllAssets } from "@/lib/preload-config"

interface UseAssetLoaderOptions {
  minimumLoadTime?: number
  timeout?: number
}

interface AssetLoaderState {
  isLoading: boolean
  progress: number
  error: string | null
  currentPhase: 'logo' | 'critical' | 'gallery' | 'complete'
}

export function useAssetLoader(options: UseAssetLoaderOptions = {}) {
  const { minimumLoadTime = 2500, timeout = 30000 } = options
  
  const [state, setState] = useState<AssetLoaderState>({
    isLoading: true,
    progress: 0,
    error: null,
    currentPhase: 'logo'
  })

  const preloadImage = useCallback((src: string, timeoutMs: number = 5000): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new window.Image()
      
      const cleanup = () => {
        img.onload = null
        img.onerror = null
      }

      const timeoutId = setTimeout(() => {
        cleanup()
        console.warn(`Timeout loading image: ${src}`)
        resolve(false) // Continue même en cas de timeout
      }, timeoutMs)

      img.onload = () => {
        cleanup()
        clearTimeout(timeoutId)
        resolve(true)
      }

      img.onerror = () => {
        cleanup()
        clearTimeout(timeoutId)
        console.warn(`Failed to load image: ${src}`)
        resolve(false) // Continue même en cas d'erreur
      }

      img.src = src
    })
  }, [])

  const loadAssets = useCallback(async () => {
    const startTime = Date.now()
    let totalLoaded = 0
    const allAssets = getAllAssets()
    
    try {
      setState(prev => ({ ...prev, error: null, currentPhase: 'logo' }))

      // Phase 1: Logo (critique pour l'écran de chargement)
      setState(prev => ({ ...prev, currentPhase: 'logo' }))
      await preloadImage("/assets/logo.png", 3000)
      totalLoaded++
      setState(prev => ({ ...prev, progress: (totalLoaded / allAssets.length) * 100 }))

      // Phase 2: Assets critiques
      setState(prev => ({ ...prev, currentPhase: 'critical' }))
      for (const asset of PRELOAD_CONFIG.critical.slice(1)) { // Skip logo déjà chargé
        await preloadImage(asset, 4000)
        totalLoaded++
        setState(prev => ({ ...prev, progress: (totalLoaded / allAssets.length) * 100 }))
      }

      // Phase 3: Images de galerie prioritaires (par batch)
      setState(prev => ({ ...prev, currentPhase: 'gallery' }))
      const priorityBatches = []
      for (let i = 0; i < PRELOAD_CONFIG.galleryPriority.length; i += 3) {
        priorityBatches.push(PRELOAD_CONFIG.galleryPriority.slice(i, i + 3))
      }

      for (const batch of priorityBatches) {
        const batchPromises = batch.map(async (src) => {
          await preloadImage(src, 4000)
          totalLoaded++
          setState(prev => ({ 
            ...prev, 
            progress: Math.min((totalLoaded / allAssets.length) * 100, 95)
          }))
        })
        await Promise.all(batchPromises)
      }

      // Phase 4: Images secondaires (en arrière-plan)
      const secondaryBatches = []
      for (let i = 0; i < PRELOAD_CONFIG.gallerySecondary.length; i += 4) {
        secondaryBatches.push(PRELOAD_CONFIG.gallerySecondary.slice(i, i + 4))
      }

      for (const batch of secondaryBatches) {
        const batchPromises = batch.map(async (src) => {
          await preloadImage(src, 3000)
          totalLoaded++
          setState(prev => ({ 
            ...prev, 
            progress: Math.min((totalLoaded / allAssets.length) * 100, 99)
          }))
        })
        await Promise.all(batchPromises)
      }

      // Respecter le temps minimum d'affichage
      const elapsedTime = Date.now() - startTime
      if (elapsedTime < minimumLoadTime) {
        await new Promise(resolve => setTimeout(resolve, minimumLoadTime - elapsedTime))
      }

      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        progress: 100, 
        currentPhase: 'complete' 
      }))

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur de chargement"
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        isLoading: false 
      }))
    }
  }, [preloadImage, minimumLoadTime])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (state.isLoading) {
        setState(prev => ({ 
          ...prev, 
          error: "Délai d'attente dépassé. Le site se charge quand même.",
          isLoading: false 
        }))
      }
    }, timeout)

    loadAssets()

    return () => clearTimeout(timeoutId)
  }, [loadAssets, timeout, state.isLoading])

  return state
}
