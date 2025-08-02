// Configuration optimisée pour le préchargement d'assets
// Basée sur les meilleures pratiques Next.js de performance

interface PreloadConfig {
  // Assets critiques (LCP - Largest Contentful Paint)
  critical: string[]
  
  // Galerie prioritaire (images above-the-fold)
  galleryPriority: string[]
  
  // Galerie secondaire (préchargement différé)
  gallerySecondary: string[]
  
  // Vidéos (préchargement spécial)
  videos: string[]
}

export const PRELOAD_CONFIG: PreloadConfig = {
  // Assets ULTRA-CRITIQUES - Logo, branding et vidéo (chargement immédiat)
  critical: [
    "/assets/logo.png",
    "/assets/22.mp4", 
    "/assets/cptr.png",
    // Vidéo critique déplacée ici pour chargement immédiat
    // FIX: SEULEMENT les 3 premières images de la galerie en critical pour éviter le clignotement mobile
    "/glow2/1.jpeg",
    "/glow2/2.jpeg", 
    "/glow2/3.jpeg",
    "/glow2/4.jpeg",
    "/glow2/5.jpeg",
    "/glow2/6.png",
    "/glow2/7.png",
    "/glow2/8.jpeg",
  ],
  
  // TOUTES les images de la galerie en priorité HAUTE (chargement immédiat après les assets critiques)
  galleryPriority: [
    "/glow2/1.jpeg",
    "/glow2/2.jpeg", 
    "/glow2/3.jpeg",
    "/glow2/4.jpeg",
    "/glow2/5.jpeg",
    "/glow2/6.png",
    "/glow2/7.png",
    "/glow2/8.jpeg",
    "/glow2/10.jpeg",
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
  ],
  
  // Images secondaires (vide maintenant - toutes déplacées en priorité)
  gallerySecondary: [
    // Toutes les images sont maintenant en priorité haute pour chargement immédiat
  ],
  
  // Vidéos avec préchargement spécialisé critique (maintenant vide car déplacé en critical)
  videos: [
    // Vidéo déplacée dans critical pour chargement immédiat
  ]
}


