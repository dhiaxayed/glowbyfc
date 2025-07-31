"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileMenuProps {
  isOpen: boolean
  onToggle: () => void
}

export function MobileMenu({ isOpen, onToggle }: MobileMenuProps) {
  const [mounted, setMounted] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  // Ensure component is mounted before using createPortal
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Reset menu state on scroll to prevent scroll position bugs
  useEffect(() => {
    if (!isOpen) return

    const handleScroll = () => {
      // Close menu if user scrolls while menu is open
      onToggle()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isOpen, onToggle])

  // Prevent body scroll when menu is open - Context7 best practice
  useEffect(() => {
    if (isOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollBarWidth}px`
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
    
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [isOpen])

  // Close menu on escape key press - Context7 best practice
  useEffect(() => {
    if (!isOpen) return

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onToggle()
      }
    }

    document.addEventListener('keydown', handleEscapeKey)
    return () => document.removeEventListener('keydown', handleEscapeKey)
  }, [isOpen, onToggle])

  // Close menu when clicking outside - Context7 best practice
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('[data-mobile-menu]')) {
        onToggle()
      }
    }

    // Small delay to prevent immediate closing
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 100)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onToggle])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      // Close menu immediately - Context7 best practice
      onToggle()
      
      // Scroll with optimized timing
      requestAnimationFrame(() => {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start' 
        })
      })
    }
  }

  // Mobile Menu Button (rendered in header)
  const menuButton = (
    <Button
      ref={menuButtonRef}
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="lg:hidden text-gray-800 hover:text-white hover:bg-gradient-to-r hover:from-rose-400 hover:to-pink-500 transition-all duration-200 border border-gray-200 hover:border-transparent shadow-sm hover:shadow-lg rounded-xl p-2"
      aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
      data-mobile-menu
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        <Menu 
          className={`absolute transition-all duration-300 ease-in-out stroke-2 w-6 h-6 ${
            isOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
        />
        <X 
          className={`absolute transition-all duration-300 ease-in-out stroke-2 w-6 h-6 ${
            isOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>
    </Button>
  )

  // Mobile Menu Overlay (rendered with Portal for proper isolation)
  const menuOverlay = isOpen && mounted ? (
    <div
      className="fixed inset-0 z-[99999] lg:hidden"
      data-mobile-menu
      style={{ 
        animation: isOpen ? 'fadeIn 0.2s ease-out' : 'fadeOut 0.2s ease-out',
        pointerEvents: isOpen ? 'auto' : 'none'
      }}
    >
      {/* Solid Background Overlay - No confusion with content */}
      <div 
        className="absolute inset-0 bg-black/80 transition-opacity duration-200"
        onClick={onToggle}
        style={{
          opacity: isOpen ? 1 : 0,
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)'
        }}
      />
      
      {/* Menu Panel - Completely isolated from page content */}
      <div
        className="absolute top-0 right-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out"
        data-mobile-menu
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          backgroundColor: '#ffffff',
          zIndex: 100000
        }}
      >
        {/* Navigation - Clean and Simple */}
        <nav className="flex flex-col pt-16 h-full" style={{ backgroundColor: '#ffffff' }}>
          {[
            { label: "Accueil", id: "home" },
            { label: "À propos", id: "about" },
            { label: "Galerie", id: "gallery" },
            { label: "Instagram", id: "instagram" },
            { label: "Newsletter", id: "newsletter" }
          ].map((item, index) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="px-8 py-6 text-left text-xl font-light text-gray-800 hover:text-rose-600 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 transition-all duration-200 border-b border-gray-100 last:border-b-0 tracking-wide"
              style={{ 
                animationDelay: `${index * 80}ms`,
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? 'translateX(0)' : 'translateX(20px)',
                transition: `all 0.4s ease-out ${index * 80}ms`,
                backgroundColor: '#ffffff'
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  ) : null

  return (
    <>
      {menuButton}
      {mounted && createPortal(menuOverlay, document.body)}
    </>
  )
}
