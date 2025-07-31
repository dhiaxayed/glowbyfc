/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configuration d'images optimisée pour la performance
  images: {
    // Garder l'optimisation des images pour de meilleures performances
    unoptimized: false,
    
    // Formats d'images modernes pour une meilleure compression
    formats: ['image/avif', 'image/webp'],
    
    // Tailles d'écran optimisées
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Qualités optimisées selon le cas d'usage
    qualities: [50, 75, 85, 95, 100],
    
    // Cache plus long pour de meilleures performances
    minimumCacheTTL: 86400, // 24 heures
    
    // Domaines autorisés pour les images externes (si nécessaire)
    domains: [],
    
    // Patterns locaux autorisés
    localPatterns: [
      {
        pathname: '/assets/**',
        search: '',
      },
      {
        pathname: '/glow2/**',
        search: '',
      },
    ],
  },
  
  // Optimisations expérimentales
  experimental: {
    // Optimiser les imports de packages
    optimizePackageImports: ['lucide-react'],
    
    // Chunking CSS optimisé
    cssChunking: true,
    
    // Ne pas précharger toutes les entrées au démarrage
    preloadEntriesOnStart: false,
  },
  
  // Configuration de compilation optimisée
  compiler: {
    // Supprimer les console.log en production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  
  // Headers de sécurité et performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/assets/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 an
          },
        ],
      },
      {
        source: '/glow2/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 an
          },
        ],
      },
    ]
  },
}

export default nextConfig
