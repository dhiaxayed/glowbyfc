"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  Heart,
  Sparkles,
  Crown,
  Truck,
  Shield,
  Instagram,
  ArrowRight,
  MessageCircle,
  MapPin,
  QrCode,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { InfiniteGallery } from "@/components/infinite-gallery"
import { AboutSection } from "@/components/about-section"
import { DeliveryBanner } from "@/components/delivery-banner"
import { NewsletterCTA } from "@/components/newsletter-cta"
import { SimpleFooter } from "@/components/simple-footer"
import { MobileMenu } from "@/components/mobile-menu"
import { AppWrapper } from "@/components/app-wrapper"
import { CriticalImagePreloader } from "@/components/optimized-preloader"
import { PerformanceOptimizer } from "@/components/performance-optimizer"

export default function GlowByFCLanding() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start' 
      })
    }
  }

  const MainContent = () => (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 text-gray-800">
      {/* Préchargement optimisé des images critiques */}
      <CriticalImagePreloader />
      
      {/* Delivery Banner */}
      <DeliveryBanner />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-rose-100/50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-rose-200 bg-white p-1 flex items-center justify-center">
                <Image
                  src="/assets/logo.png"
                  alt="Glow by FC Logo"
                  width={44}
                  height={44}
                  className="w-full h-full object-contain rounded-full"
                  priority
                  quality={85}
                />
              </div>
              <div className="flex flex-col">
                <button
                  onClick={() => scrollToSection('home')}
                  className="text-xl lg:text-2xl font-light tracking-wider text-gray-800 hover:text-rose-600 transition-colors text-left"
                >
                  GLOW <span className="font-semibold">BY FC</span>
                </button>
                <span className="text-xs tracking-wide text-gray-500">by @farah.charabi</span>
              </div>
            </div>

            <nav className="hidden lg:flex items-center space-x-8 xl:space-x-12">
              <button
                onClick={() => scrollToSection('home')}
                className="transition-colors font-light tracking-wide text-sm text-gray-600 hover:text-gray-900 hover:scale-105 duration-200"
              >
                Accueil
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="transition-colors font-light tracking-wide text-sm text-gray-600 hover:text-gray-900 hover:scale-105 duration-200"
              >
                À propos
              </button>
              <button
                onClick={() => scrollToSection('gallery')}
                className="transition-colors font-light tracking-wide text-sm text-gray-600 hover:text-gray-900 hover:scale-105 duration-200"
              >
                Galerie
              </button>
              <button
                onClick={() => scrollToSection('instagram')}
                className="transition-colors font-light tracking-wide text-sm text-gray-600 hover:text-gray-900 hover:scale-105 duration-200"
              >
                Instagram
              </button>
              <button
                onClick={() => scrollToSection('newsletter')}
                className="transition-colors font-light tracking-wide text-sm text-gray-600 hover:text-gray-900 hover:scale-105 duration-200"
              >
                Newsletter
              </button>
            </nav>

            <div className="flex items-center space-x-3">
              <Link href="https://www.instagram.com/glow_by_fc/" target="_blank" rel="noopener noreferrer">
              <Button className="hidden sm:flex bg-gradient-to-r from-rose-400 to-pink-500 text-white hover:from-rose-500 hover:to-pink-600 font-medium px-4 lg:px-6 shadow-lg hover:shadow-xl transition-all duration-200">
                <MessageCircle className="h-4 w-4 mr-2" />
                Shop now
              </Button>
              </Link>
              
              {/* Mobile Shop Button */}
              <Link href="https://www.instagram.com/glow_by_fc/" target="_blank" rel="noopener noreferrer">
              <Button className="sm:hidden bg-gradient-to-r from-rose-400 to-pink-500 text-white hover:from-rose-500 hover:to-pink-600 font-medium px-3 shadow-lg">
                <MessageCircle className="h-4 w-4" />
              </Button>
              </Link>

              {/* Mobile Menu Button */}
              <MobileMenu 
              isOpen={isMobileMenuOpen} 
              onToggle={toggleMobileMenu} 
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-16 pb-16 lg:pt-24 lg:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8 lg:space-y-12">
              <div className="space-y-6 lg:space-y-8">
                <div className="flex items-center space-x-3">
                  <Badge className="bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200 backdrop-blur-sm">
                    ✨ Collection 2025
                  </Badge>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-light leading-none tracking-tight">
                  <span className="block text-gray-900">YOUR DAILY</span>
                  <span className="block font-semibold bg-gradient-to-r from-rose-400 via-pink-500 to-amber-400 bg-clip-text text-transparent">
                    DOSE OF
                  </span>
                  <span className="block text-gray-600">GLOW & STYLE</span>
                </h1>
                <p className="text-lg lg:text-xl leading-relaxed max-w-lg font-light text-gray-600">
                  Découvrez notre univers où
                  chaque pièce est soigneusement sélectionnée pour révéler votre éclat stylé.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
                <Button
                  size="lg"
                  onClick={() => scrollToSection('gallery')}
                  className="bg-gradient-to-r from-rose-400 to-pink-500 text-white hover:from-rose-500 hover:to-pink-600 text-base lg:text-lg px-8 lg:px-10 py-3 lg:py-4 font-medium shadow-lg"
                >
                  Découvrir Collections
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Link href="https://www.instagram.com/glow_by_fc/" target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto text-base lg:text-lg px-8 lg:px-10 py-3 lg:py-4 bg-transparent font-light transition-colors border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Instagram className="mr-2 h-5 w-5" />
                    Suivre @glow_by_fc
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-center sm:justify-start space-x-8 lg:space-x-12 pt-6 lg:pt-8">
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-light text-gray-900 h-8 lg:h-10 flex items-center justify-center">+50</div>
                  <div className="text-xs lg:text-sm font-light tracking-wide text-gray-500">CREATIONS</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-light text-gray-900 h-8 lg:h-10 flex items-center justify-center">100%</div>
                  <div className="text-xs lg:text-sm font-light tracking-wide text-gray-500">SATISFACTION</div>
                </div>
                <div className="text-center">
                  <div className="h-8 lg:h-10 flex items-center justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 lg:h-4 lg:w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="text-xs lg:text-sm font-light tracking-wide text-gray-500">TUNISIE 🇹🇳</div>
                </div>
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0 w-full max-w-lg mx-auto lg:max-w-md xl:max-w-lg">
              {/* Backdrop blur effect - Optimized positioning */}
              <div className="absolute -inset-4 bg-gradient-to-r from-rose-400/12 via-pink-400/12 to-amber-400/12 rounded-3xl blur-xl opacity-60"></div>
              
              {/* Video container - Mobile-first responsive design with reduced size for web */}
              <div className="relative aspect-[4/5] lg:aspect-[3/4] w-full rounded-2xl lg:rounded-3xl overflow-hidden border border-rose-200/30 shadow-xl backdrop-blur-sm bg-white/60">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  poster=""
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ 
                    filter: 'brightness(1.02) contrast(1.01) saturate(1.05)'
                  }}
                  onLoadStart={() => console.log('Video loading started')}
                  onCanPlay={() => console.log('Video ready to play')}
                  onError={(e) => console.error('Video error:', e)}
                >
                  <source src="/assets/22.mp4" type="video/mp4" />
                  {/* Enhanced fallback with better UX */}
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-6">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-rose-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zM12 8a1 1 0 012 0v4a1 1 0 11-2 0V8z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-gray-700 font-medium mb-2">Vidéo non disponible</p>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Essayez avec Chrome, Safari ou Firefox
                        <br />
                        <span className="text-xs">ou vérifiez votre connexion</span>
                      </p>
                    </div>
                  </div>
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Infinite Gallery Section */}
      <section id="gallery" className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 lg:space-y-8 mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-light text-gray-900">
              <span className="block">GALERIE</span>
              <span className="block font-semibold">EXCLUSIVE</span>
            </h2>
            <p className="text-lg lg:text-xl max-w-2xl mx-auto font-light leading-relaxed text-gray-600">
              Plongez dans l'univers Glow by FC à travers nos créations
            </p>
          </div>
        </div>

        <InfiniteGallery />
      </section>

      {/* Instagram Section */}
      <section id="instagram" className="py-16 lg:py-24 bg-gradient-to-b from-white to-rose-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8 lg:space-y-12">
              <div className="space-y-6 lg:space-y-8">
                <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0">
                  <Instagram className="mr-2 h-4 w-4" />
                  @glow_by_fc
                </Badge>
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-light leading-tight">
                  <span className="block text-gray-900">SUIVEZ-NOUS</span>
                  <span className="block font-semibold text-gray-900">SUR INSTAGRAM</span>
                  <span className="block text-gray-600">POUR PLUS</span>
                </h2>
                <p className="text-lg lg:text-xl leading-relaxed font-light max-w-lg text-gray-600">
                  DM pour découvrir nos pièces exclusives. Livraison gratuite dès 99dt partout en Tunisie. Votre dose
                  quotidienne de style et d'éclat.
                </p>
              </div>

              <div className="space-y-4 lg:space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-base lg:text-lg font-medium text-gray-900">DM to Shop</div>
                    <div className="text-gray-600 font-light">Commandez directement via Instagram</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                    <Truck className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-base lg:text-lg font-medium text-gray-900">Livraison Gratuite 99dt+</div>
                    <div className="text-gray-600 font-light">Partout en Tunisie</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-base lg:text-lg font-medium text-gray-900">Made in Tunisia 🇹🇳</div>
                    <div className="text-gray-600 font-light">Créé avec passion</div>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                onClick={() => window.open('https://www.instagram.com/glow_by_fc/', '_blank', 'noopener,noreferrer')}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-base lg:text-lg px-8 lg:px-10 py-3 lg:py-4 font-medium shadow-lg"
              >
                <Instagram className="mr-2 h-5 w-5" />
                Suivre @glow_by_fc
              </Button>
            </div>

            <div className="relative flex justify-center mt-8 lg:mt-0">
              {/* Elegant Phone Mockup with Screenshot - Mobile Optimized */}
              <div className="relative">
                {/* Background Design Elements - Advanced UI/UX */}
                <div className="absolute inset-0 -z-30">
                  {/* Animated gradient orbs */}
                  <div className="absolute top-8 -left-8 w-32 h-32 bg-gradient-to-br from-rose-300/30 to-pink-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '4s' }}></div>
                  <div className="absolute -top-4 right-12 w-24 h-24 bg-gradient-to-br from-purple-300/25 to-rose-300/20 rounded-full blur-xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
                  <div className="absolute bottom-12 -right-6 w-28 h-28 bg-gradient-to-br from-amber-300/20 to-orange-300/15 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
                  
                  {/* Floating geometric shapes */}
                  <div className="absolute top-16 right-8 w-3 h-3 bg-rose-400/40 rounded-full animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
                  <div className="absolute bottom-20 left-4 w-2 h-2 bg-purple-400/50 rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '1.5s' }}></div>
                  <div className="absolute top-32 -left-2 w-1.5 h-1.5 bg-pink-400/60 rounded-full animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '2.5s' }}></div>
                  
                  {/* Subtle grid pattern */}
                  <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(219, 39, 119, 0.3) 1px, transparent 0)',
                    backgroundSize: '20px 20px'
                  }}></div>
                </div>

                {/* Interactive hover zone */}
                <div className="absolute inset-0 -z-20 transition-all duration-700 ease-out hover:scale-105 hover:rotate-1">
                  {/* Layered glow effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-400/15 via-pink-500/10 to-purple-400/15 rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] blur-2xl animate-pulse" style={{ animationDuration: '8s' }}></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-300/10 via-rose-300/15 to-pink-400/10 rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] blur-xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
                </div>

                {/* Phone Frame - Realistic proportions for all devices */}
                <div className="relative w-64 sm:w-72 md:w-80 lg:w-[320px] xl:w-[340px] h-[420px] sm:h-[480px] md:h-[520px] lg:h-[560px] xl:h-[600px] rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] p-1.5 sm:p-2 shadow-2xl border bg-gray-800 border-gray-300 transition-all duration-300 hover:shadow-3xl hover:scale-[1.02] group">
                  
                  {/* Realistic Physical Buttons */}
                  {/* Volume Up Button */}
                  <div className="absolute -left-[1px] top-[80px] w-[2px] h-6 bg-gray-700 rounded-l-sm shadow-inner"></div>
                  {/* Volume Down Button */}
                  <div className="absolute -left-[1px] top-[110px] w-[2px] h-6 bg-gray-700 rounded-l-sm shadow-inner"></div>
                  {/* Power Button */}
                  <div className="absolute -right-[1px] top-[95px] w-[2px] h-10 bg-gray-700 rounded-r-sm shadow-inner"></div>
                  
                  {/* Phone Screen Container */}
                  <div className="w-full h-full bg-white rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden relative transition-all duration-300 group-hover:shadow-inner">
                    {/* Instagram Screenshot */}
                    <Image
                      src="/assets/cptr.png"
                      alt="Glow by FC Instagram Profile"
                      fill
                      priority
                      quality={95}
                      sizes="(max-width: 640px) 256px, (max-width: 768px) 288px, (max-width: 1024px) 320px, 340px"
                      className="object-cover object-top transition-all duration-300 group-hover:scale-[1.01]"
                      style={{
                        filter: 'brightness(1.02) contrast(1.01) saturate(1.05)',
                      }}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyruiHlOdI/dxbqmPxA6HVWKGN1CxMrAYFJHkU6d6FYMy6MZ1wdISBSYHiVZ8qWGrLTwCFcjfnXn/9k="
                    />
                    
                    {/* Enhanced overlay with interactive elements */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none transition-opacity duration-300 group-hover:from-black/10"></div>
                    
                    {/* Subtle shine effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>
                  </div>

                  {/* Premium border glow effect */}
                  <div className="absolute inset-0 rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] border-2 border-gradient-to-r from-rose-300/20 via-pink-300/30 to-purple-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Enhanced Glow Effects - Mobile responsive with interaction */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-600/20 to-rose-500/20 rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] blur-xl sm:blur-2xl -z-10 transition-all duration-500"></div>
                <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-pink-300/10 via-purple-400/10 to-rose-300/10 rounded-[2.5rem] sm:rounded-[3rem] lg:rounded-[4rem] blur-2xl sm:blur-3xl -z-20 transition-all duration-700"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-rose-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              {
                icon: MessageCircle,
                title: "DM TO SHOP",
                description: "Commandez directement via Instagram",
              },
              {
                icon: Truck,
                title: "LIVRAISON GRATUITE 99dt+",
                description: "Partout en Tunisie ",
              },
              {
                icon: Shield,
                title: "QUALITÉ GARANTIE",
                description: "Pièces sélectionnées avec soin • Satisfaction 100% assurée",
              },
              {
                icon: Crown,
                title: "CRÉATIONS EXCLUSIVES",
                description: "Designs uniques • Éditions limitées ",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center space-y-4 lg:space-y-6">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <feature.icon className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                </div>
                <h3 className="text-base lg:text-lg font-medium tracking-wide text-gray-900">{feature.title}</h3>
                <p className="font-light leading-relaxed text-sm lg:text-base text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <NewsletterCTA />

      {/* Simple Footer */}
      <SimpleFooter />
    </div>
  )

  return (
    <AppWrapper>
      <PerformanceOptimizer />
      <MainContent />
    </AppWrapper>
  )
}
