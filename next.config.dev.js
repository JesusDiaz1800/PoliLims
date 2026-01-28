/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración mínima para desarrollo
  experimental: {
    // Deshabilitar optimizaciones en desarrollo
    optimizeCss: false,
    optimizePackageImports: [],
  },
  
  // Deshabilitar compresión en desarrollo
  compress: false,
  
  // Optimización de imágenes básica
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  
  // Webpack optimizado para desarrollo
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Deshabilitar minificación
      config.optimization.minimize = false;
      
      // Chunks simples para desarrollo
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
      
      // Reducir el nivel de detalle de los source maps
      config.devtool = 'eval-source-map';
    }
    
    return config;
  },
  
  // Headers básicos
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
