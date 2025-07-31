// Configuration des assets à précharger
export const PRELOAD_CONFIG = {
  // Assets critiques à charger en priorité
  critical: [
    "/assets/logo.png",
    "/assets/cptr.png",
    "/placeholder.jpg"
  ],
  
  // Images de la galerie (premières pour l'affichage initial)
  galleryPriority: [
    "/glow2/1.jpeg",
    "/glow2/2.jpeg", 
    "/glow2/3.jpeg",
    "/glow2/4.jpeg",
    "/glow2/5.jpeg",
    "/glow2/6.png"
  ],
  
  // Reste des images de la galerie
  gallerySecondary: [
    "/glow2/7.png",
    "/glow2/8.jpeg",
    "/glow2/9.jpeg",
    "/glow2/10.jpeg",
    "/glow2/11.jpeg",
    "/glow2/12.jpeg",
    "/glow2/13.jpeg",
    "/glow2/14.png",
    "/glow2/15.png",
    "/glow2/16.png",
    "/glow2/17.png",
    "/glow2/18.png",
    "/glow2/19.png",
    "/glow2/20.jpeg",
    "/glow2/21.jpeg",
    "/glow2/22.jpeg",
    "/glow2/23.jpeg",
    "/glow2/24.jpeg",
    "/glow2/25.jpeg",
    "/glow2/26.jpeg",
    "/glow2/27.jpeg",
    "/glow2/28.jpeg",
    "/glow2/29.jpeg",
    "/glow2/30.jpeg",
    "/glow2/31.jpeg",
    "/glow2/32.jpeg",
    "/glow2/33.jpeg",
    "/glow2/34.jpeg",
    "/glow2/35.jpeg",
    "/glow2/36.jpeg",
    "/glow2/37.png",
    "/glow2/38.jpeg"
  ]
}

// Fonction utilitaire pour obtenir tous les assets
export const getAllAssets = () => [
  ...PRELOAD_CONFIG.critical,
  ...PRELOAD_CONFIG.galleryPriority,
  ...PRELOAD_CONFIG.gallerySecondary
]
