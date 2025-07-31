"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Heart, Crown, Star } from "lucide-react"

export function AboutSection() {
  return (
    <section id="about" className="py-16 lg:py-24 bg-gradient-to-b from-white to-rose-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-[600px]">
          <div className="w-full max-w-6xl">
            
            {/* Section principale centrée */}
            <div className="text-center space-y-8 lg:space-y-12">
              
              {/* Badge et titre */}
              <div className="space-y-6 lg:space-y-8">
                <div className="flex justify-center">
                  <Badge className="bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200">
                    <Heart className="mr-2 h-4 w-4" />
                    Notre Histoire
                  </Badge>
                </div>
                
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-light leading-tight text-gray-900">
                  <span className="block">L'ART DE</span>
                  <span className="block font-semibold bg-gradient-to-r from-rose-400 via-pink-500 to-amber-400 bg-clip-text text-transparent">
                    RÉVÉLER
                  </span>
                  <span className="block text-gray-600">VOTRE ÉCLAT</span>
                </h2>
                
                <div className="max-w-4xl mx-auto">
                  <p className="text-lg lg:text-xl leading-relaxed font-light text-gray-600">
                    Née de la passion  pour la beauté et l'élégance, <strong>Glow by FC</strong> incarne
                    l'art de sublimer l'apparence de nos clients. Chaque création est pensée pour révéler votre
                    style unique et votre charme authentique.
                  </p>
                </div>
              </div>

              {/* Cartes de caractéristiques */}
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
                  <div className="text-center p-6 lg:p-8 bg-white/80 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                    </div>
                    <div className="font-medium text-gray-900 mb-2 text-lg">Créativité</div>
                    <div className="text-sm lg:text-base text-gray-600 font-light">Articles uniques et innovants</div>
                  </div>
                  
                  <div className="text-center p-6 lg:p-8 bg-white/80 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Crown className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                    </div>
                    <div className="font-medium text-gray-900 mb-2 text-lg">Qualité</div>
                    <div className="text-sm lg:text-base text-gray-600 font-light">Matériaux premium sélectionnés</div>
                  </div>
                </div>

                {/* Mission */}
                <div className="max-w-4xl mx-auto">
                  <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-6 lg:p-8 border border-rose-100">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-4">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                        <Star className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2 text-lg lg:text-xl">Notre Mission</h3>
                        <p className="text-gray-600 font-light leading-relaxed text-sm lg:text-base">
                          Nous croyons que chacun mérite de <strong>briller</strong>.
                          Notre mission est d'offrir à nos clients des accessoires d'exception qui reflètent leur beauté intérieure et
                          leur confiance en eux.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            
              
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
