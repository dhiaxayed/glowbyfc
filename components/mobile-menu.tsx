"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Menu, X, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileMenuProps {
  isOpen: boolean
  onToggle: () => void
}

export function MobileMenu({ isOpen, onToggle }: MobileMenuProps) {
  const [mounted, setMounted] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  // Ensure component is mounted before using createPortal - Context7 best practice
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Prevent body scroll when menu is open - Context7 best practice for modal behavior
  useEffect(() => {
    if (isOpen) {
      // Calculate scrollbar width to prevent layout shift
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
      const originalStyle = window.getComputedStyle(document.body)
      const originalOverflow = originalStyle.overflow
      const originalPaddingRight = originalStyle.paddingRight
      
      // Store original values
      document.body.setAttribute('data-original-overflow', originalOverflow)
      document.body.setAttribute('data-original-padding-right', originalPaddingRight)
      
      // Apply scroll lock
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollBarWidth}px`
      
      // Add mobile menu active class for additional styling control
      document.documentElement.classList.add('mobile-menu-active')
    } else {
      // Restore original styles
      const originalOverflow = document.body.getAttribute('data-original-overflow') || ''
      const originalPaddingRight = document.body.getAttribute('data-original-padding-right') || ''
      
      document.body.style.overflow = originalOverflow
      document.body.style.paddingRight = originalPaddingRight
      
      // Clean up attributes
      document.body.removeAttribute('data-original-overflow')
      document.body.removeAttribute('data-original-padding-right')
      
      // Remove mobile menu active class
      document.documentElement.classList.remove('mobile-menu-active')
    }
    
    return () => {
      // Cleanup on unmount
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      document.documentElement.classList.remove('mobile-menu-active')
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
      // Check if click is outside the menu panel
      if (!target.closest('[data-mobile-menu-panel]') && 
          !target.closest('[data-mobile-menu-button]')) {
        onToggle()
      }
    }

    // Small delay to prevent immediate closing when opening
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 150)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onToggle])

  // Optimized scroll to section function - Context7 best practice
  const scrollToSection = (sectionId: string) => {
    // Close menu immediately for better UX
    onToggle()
    
    // Use requestAnimationFrame for smooth animation timing
    requestAnimationFrame(() => {
      const element = document.getElementById(sectionId)
      if (element) {
        // Calculate offset for sticky header
        const headerHeight = 80 // Approximate header height
        const elementPosition = element.offsetTop - headerHeight
        
        // Use smooth scroll with proper timing
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        })
      }
    })
  }

  // Mobile Menu Button (rendered in header) - Context7 optimized
  const menuButton = (
    <Button
      ref={menuButtonRef}
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="lg:hidden text-gray-800 hover:text-white hover:bg-gradient-to-r hover:from-rose-400 hover:to-pink-500 transition-all duration-200 border border-gray-200 hover:border-transparent shadow-sm hover:shadow-lg rounded-xl p-2 relative z-50"
      aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
      aria-expanded={isOpen}
      data-mobile-menu-button
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

  // Mobile Menu Overlay - Context7 best practices for modal overlays
  const menuOverlay = mounted ? (
    <div
      className={`fixed inset-0 lg:hidden transition-all duration-300 ease-out ${
        isOpen ? 'z-[99999] opacity-100 pointer-events-auto' : 'z-[-1] opacity-0 pointer-events-none'
      }`}
      onClick={(e) => {
        // Close when clicking on backdrop
        if (e.target === e.currentTarget) {
          onToggle()
        }
      }}
    >
      {/* Backdrop Overlay with blur effect */}
      <div 
        className="absolute inset-0 bg-black/75 transition-opacity duration-300"
        style={{
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}
      />
      
      {/* Menu Panel - Right slide-in with proper Context7 styling */}
      <div
        className={`absolute top-0 right-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        data-mobile-menu-panel
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          zIndex: 100001
        }}
      >
        {/* Close button inside panel for better UX */}
        <div className="flex justify-end p-4 border-b border-gray-100">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Navigation Menu - Context7 optimized */}
        <nav className="flex flex-col py-6 h-full overflow-y-auto">
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
              className="px-8 py-4 text-left text-lg font-light text-gray-800 hover:text-rose-600 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 transition-all duration-200 border-b border-gray-50 last:border-b-0 tracking-wide flex items-center group"
              style={{ 
                animationDelay: `${index * 100}ms`,
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? 'translateX(0)' : 'translateX(30px)',
                transition: `all 0.4s ease-out ${index * 100}ms`
              }}
            >
              <span className="flex-1">{item.label}</span>
              <div className="w-2 h-2 bg-rose-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </button>
          ))}
          
          {/* Additional Shop Button in Mobile Menu */}
          <div className="px-8 pt-8 mt-auto">
            <Button
              onClick={() => {
                window.open('https://www.instagram.com/glow_by_fc/', '_blank', 'noopener,noreferrer')
                onToggle()
              }}
              className="w-full bg-gradient-to-r from-rose-400 to-pink-500 text-white hover:from-rose-500 hover:to-pink-600 font-medium py-3 shadow-lg"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Shop Now via Instagram
            </Button>
          </div>
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
