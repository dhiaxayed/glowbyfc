"use client"

import { Truck, Sparkles } from "lucide-react"

export function DeliveryBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 border-b border-rose-100/60">
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-rose-200/20 rounded-full blur-2xl animate-pulse" 
             style={{ animationDuration: '4s', animationDelay: '0s' }} />
        <div className="absolute top-0 right-1/4 w-24 h-24 bg-amber-200/20 rounded-full blur-2xl animate-pulse" 
             style={{ animationDuration: '4s', animationDelay: '2s' }} />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Scrolling text container */}
        <div className="flex items-center justify-center space-x-3 text-center">
          
          {/* Icon with enhanced styling */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="relative w-8 h-8 bg-gradient-to-r from-rose-400 via-pink-500 to-amber-400 rounded-full flex items-center justify-center shadow-lg">
              <Truck className="h-4 w-4 text-white" />
              {/* Subtle ping effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-rose-400 via-pink-500 to-amber-400 rounded-full animate-ping opacity-20" 
                   style={{ animationDuration: '3s' }} />
            </div>
            
            {/* Animated scrolling text */}
            <div className="overflow-hidden whitespace-nowrap max-w-[200px] sm:max-w-[300px] lg:max-w-[400px]">
              <div className="inline-block animate-scroll">
                <span className="text-rose-800 font-medium text-sm lg:text-base">
                  Livraison <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 bg-clip-text text-transparent font-bold">GRATUITE</span> dès 99dt
                </span>
              </div>
            </div>
          </div>

          {/* Separator with subtle animation */}
          <div className="hidden sm:block flex-shrink-0">
            <div className="w-px h-6 bg-gradient-to-b from-rose-300 via-pink-300 to-amber-300 opacity-60 animate-pulse" 
                 style={{ animationDuration: '2s', animationDelay: '1s' }} />
          </div>

          {/* Secondary content */}
          <div className="hidden sm:flex items-center space-x-2 flex-shrink-0">
            <Sparkles className="h-4 w-4 text-amber-500 animate-spin" 
                     style={{ animationDuration: '4s' }} />
            <span className="text-gray-600 text-sm font-light">
              Partout en Tunisie • Service rapide
            </span>
          </div>
        </div>

        {/* Mobile secondary text */}
        <div className="sm:hidden mt-2 text-center">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="h-3 w-3 text-amber-500 animate-spin" 
                     style={{ animationDuration: '4s' }} />
            <span className="text-gray-500 text-xs font-light">
              Partout en Tunisie • Service rapide
            </span>
          </div>
        </div>
      </div>

      {/* Bottom gradient accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-200/80 to-transparent" />

      {/* Custom CSS for scrolling animation */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .animate-scroll {
          animation: scroll 8s linear infinite;
        }
        
        /* Pause animation on hover for better UX */
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
