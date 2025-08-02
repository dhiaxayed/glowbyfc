/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configuration d'images optimisée pour mobile-first avec Context7 best practices
  images: {
    // Optimisation des images activée pour de meilleures performances
    unoptimized: false,
    
    // Formats optimisés avec AVIF en priorité pour une compression supérieure
    formats: ['image/avif', 'image/webp'],
    
    // Tailles d'écran optimisées pour le responsive
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Cache plus long pour de meilleures performances
    minimumCacheTTL: 86400, // 24 heures
    
    // Qualités optimisées pour différents contextes
    qualities: [40, 50, 65, 75, 85, 90, 95], // Gamme étendue pour s'adapter aux connexions + qualité max
    
    // Domaines autorisés pour les images externes
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
    
    // Optimisations mobile
    loader: 'default',
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    contentDispositionType: 'inline', // Pour un affichage plus rapide
  },

  // Optimisations expérimentales selon Context7 best practices
  experimental: {
    // Optimiser les imports de packages pour réduire la taille du bundle
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    
    // Chunking CSS optimisé
    cssChunking: true,
  },

  // Configuration de compilation optimisée
  compiler: {
    // Supprimer les console.log en production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },

  // Optimisations pour la production
  poweredByHeader: false,
  compress: true,

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
