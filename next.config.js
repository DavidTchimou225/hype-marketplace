/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Configuration pour les uploads de fichiers
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Désactiver les optimisations qui peuvent causer des problèmes avec les uploads
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
