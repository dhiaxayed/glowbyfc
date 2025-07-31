"use client"

import { Instagram, Facebook } from "lucide-react"
import Link from "next/link"

// Note: Lucide doesn't have a TikTok icon, so we'll use a simple SVG
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.43Z"/>
  </svg>
)

export function SimpleFooter() {
  return (
    <footer className="bg-white/95 backdrop-blur-sm border-t border-gray-200/60 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="flex flex-col items-center space-y-8">
            
            {/* Social Media Section */}
            <div className="text-center">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 tracking-wide uppercase">
                Suivez-nous
              </h3>
              <p className="text-sm text-gray-600 mb-6 max-w-xs">
                Restez connecté pour découvrir nos dernières actualités, collections uniques et offres exclusives.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link 
                  href="https://www.instagram.com/glow_by_fc/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 text-gray-600 hover:text-white hover:border-pink-400 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-200/50 overflow-hidden"
                  aria-label="Suivez-nous sur Instagram"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                  <Instagram className="h-5 w-5 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                </Link>
                
                <Link 
                  href="https://www.tiktok.com/@glow.by.fc" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 text-gray-600 hover:text-white hover:border-gray-400 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-200/50 overflow-hidden"
                  aria-label="Suivez-nous sur TikTok"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                  <TikTokIcon className="h-5 w-5 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                </Link>
                
                <Link 
                  href="https://www.facebook.com/profile.php?id=61578241450270" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 text-gray-600 hover:text-white hover:border-blue-400 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-200/50 overflow-hidden"
                  aria-label="Suivez-nous sur Facebook"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                  <Facebook className="h-5 w-5 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200/60 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-center md:text-left">
            
            {/* Copyright */}
            <div className="flex-1">
              <p className="text-sm text-gray-500 font-medium tracking-wide">
                © 2025 <span className="text-gray-700 font-semibold">Glow by FC</span>. Tous droits réservés.
              </p>
            </div>
            
           
                  <div className="flex items-center justify-center md:justify-end gap-6 text-xs text-gray-500">
                    <span className="hover:text-gray-700 transition-colors duration-200 font-medium">
                    Mentions légales
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="hover:text-gray-700 transition-colors duration-200 font-medium">
                    Confidentialité
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="hover:text-gray-700 transition-colors duration-200 font-medium">
                    CGV
                    </span>
                  </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
