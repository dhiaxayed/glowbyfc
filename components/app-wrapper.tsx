"use client"

import React, { useEffect } from "react"
import { useBackgroundAssetLoader } from "@/hooks/use-background-asset-loader"
import { VideoPreloader } from "./video-preloader"

interface AppWrapperProps {
  children: React.ReactNode
}

export function AppWrapper({ children }: AppWrapperProps) {
  // Préchargement silencieux en arrière-plan
  useBackgroundAssetLoader()

  return (
    <div className="min-h-screen">
      {/* Préchargement silencieux des vidéos */}
      <VideoPreloader />
      {children}
    </div>
  )
}
