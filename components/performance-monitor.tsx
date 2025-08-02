"use client"

import { useEffect, useState } from "react"

interface PerformanceMetrics {
  fps: number
  memoryUsage: number
  connectionType: string
  deviceMemory: number
  touchLatency: number
  imageLoadTime: number
}

export function PerformanceMonitor({ isEnabled = false }: { isEnabled?: boolean }) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    connectionType: 'unknown',
    deviceMemory: 0,
    touchLatency: 0,
    imageLoadTime: 0
  })

  useEffect(() => {
    if (!isEnabled || typeof window === 'undefined') return

    let frameCount = 0
    let lastTime = performance.now()
    let animationId: number

    // FPS monitoring
    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        frameCount = 0
        lastTime = currentTime
        
        setMetrics(prev => ({ ...prev, fps }))
      }
      
      animationId = requestAnimationFrame(measureFPS)
    }

    // Memory usage monitoring (if available)
    const updateMemoryUsage = () => {
      const memory = (performance as any).memory
      if (memory) {
        const usedJSHeapSize = memory.usedJSHeapSize / 1048576 // Convert to MB
        setMetrics(prev => ({ ...prev, memoryUsage: Math.round(usedJSHeapSize) }))
      }
    }

    // Connection monitoring
    const updateConnectionInfo = () => {
      const connection = (navigator as any).connection
      if (connection) {
        setMetrics(prev => ({ 
          ...prev, 
          connectionType: connection.effectiveType || 'unknown'
        }))
      }

      const deviceMemory = (navigator as any).deviceMemory || 0
      setMetrics(prev => ({ ...prev, deviceMemory }))
    }

    // Touch latency monitoring
    const monitorTouchLatency = () => {
      let touchStartTime = 0
      
      const handleTouchStart = () => {
        touchStartTime = performance.now()
      }
      
      const handleTouchEnd = () => {
        if (touchStartTime > 0) {
          const latency = performance.now() - touchStartTime
          setMetrics(prev => ({ ...prev, touchLatency: Math.round(latency) }))
        }
      }
      
      document.addEventListener('touchstart', handleTouchStart, { passive: true })
      document.addEventListener('touchend', handleTouchEnd, { passive: true })
      
      return () => {
        document.removeEventListener('touchstart', handleTouchStart)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }

    // Image load time monitoring
    const monitorImageLoading = () => {
      const imageObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.name.includes('/glow2/') || entry.name.includes('/assets/')) {
            const loadTime = entry.duration
            setMetrics(prev => ({ ...prev, imageLoadTime: Math.round(loadTime) }))
          }
        })
      })
      
      imageObserver.observe({ entryTypes: ['navigation', 'resource'] })
      
      return () => imageObserver.disconnect()
    }

    // Start monitoring
    animationId = requestAnimationFrame(measureFPS)
    updateConnectionInfo()
    const cleanupTouch = monitorTouchLatency()
    const cleanupImages = monitorImageLoading()
    
    // Update memory usage periodically
    const memoryInterval = setInterval(updateMemoryUsage, 2000)

    return () => {
      cancelAnimationFrame(animationId)
      clearInterval(memoryInterval)
      cleanupTouch()
      cleanupImages()
    }
  }, [isEnabled])

  if (!isEnabled) return null

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-2 rounded-lg text-xs font-mono z-50">
      <div className="space-y-1">
        <div>FPS: <span className={metrics.fps < 30 ? 'text-red-400' : metrics.fps < 50 ? 'text-yellow-400' : 'text-green-400'}>{metrics.fps}</span></div>
        <div>Memory: {metrics.memoryUsage}MB</div>
        <div>Connection: {metrics.connectionType}</div>
        <div>Device RAM: {metrics.deviceMemory}GB</div>
        <div>Touch Latency: {metrics.touchLatency}ms</div>
        <div>Image Load: {metrics.imageLoadTime}ms</div>
      </div>
    </div>
  )
}

// Hook for programmatic access to performance metrics
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    connectionType: 'unknown',
    deviceMemory: 0,
    touchLatency: 0,
    imageLoadTime: 0
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Basic metrics collection
    const connection = (navigator as any).connection
    const deviceMemory = (navigator as any).deviceMemory || 4
    
    setMetrics(prev => ({
      ...prev,
      connectionType: connection?.effectiveType || 'unknown',
      deviceMemory
    }))
  }, [])

  return metrics
}
