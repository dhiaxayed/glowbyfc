/**
 * Configuration pour la conversion d'images
 * Glow by FC - Optimisations WebP/AVIF
 */

module.exports = {
  // Formats de sortie avec leurs paramètres
  formats: {
    webp: {
      quality: 85,        // Qualité optimale pour WebP
      effort: 6,          // Compression maximale (0-6)
      nearLossless: false,
      smartSubsample: true,
      preset: 'photo'     // Optimisé pour les photos
    },
    avif: {
      quality: 80,        // Qualité légèrement réduite pour AVIF (compression supérieure)
      effort: 6,          // Compression maximale (0-9)
      chromaSubsampling: '4:2:0',
      speed: 6            // Vitesse de compression (0-10, plus bas = plus lent mais meilleur)
    }
  },

  // Chemins d'entrée
  inputPaths: [
    'public/assets/**/*.{jpg,jpeg,png,JPG,JPEG,PNG}',
    'public/glow2/**/*.{jpg,jpeg,png,JPG,JPEG,PNG}',
    'public/*.{jpg,jpeg,png,JPG,JPEG,PNG}'
  ],

  // Fichiers à ignorer
  ignore: [
    'node_modules/**',
    '.next/**',
    '**/*.webp',
    '**/*.avif',
    '**/*.svg',
    '**/placeholder*' // Ignorer les placeholders
  ],

  // Options de traitement
  processing: {
    minSize: 1024,      // Taille minimale en bytes (1KB)
    maxWidth: 2048,     // Largeur maximale (redimensionnement automatique)
    maxHeight: 2048,    // Hauteur maximale
    progressive: true,   // JPEG progressif pour les fallbacks
    stripMetadata: true, // Supprimer les métadonnées pour réduire la taille
    concurrent: 4       // Nombre de conversions simultanées
  },

  // Options selon l'environnement
  development: {
    quality: {
      webp: 75,
      avif: 70
    },
    effort: {
      webp: 3,
      avif: 3
    }
  },

  production: {
    quality: {
      webp: 85,
      avif: 80
    },
    effort: {
      webp: 6,
      avif: 6
    }
  },

  // Extensions de fichiers supportées
  supportedFormats: ['.jpg', '.jpeg', '.png'],

  // Configuration pour différents types d'images
  imageTypes: {
    photo: {
      webp: { quality: 85, effort: 6 },
      avif: { quality: 80, effort: 6 }
    },
    graphic: {
      webp: { quality: 90, effort: 6, nearLossless: true },
      avif: { quality: 85, effort: 6 }
    },
    thumbnail: {
      webp: { quality: 75, effort: 4 },
      avif: { quality: 70, effort: 4 }
    }
  }
};
