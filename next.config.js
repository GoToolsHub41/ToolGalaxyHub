/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Static site generation
  images: {
    unoptimized: true,  // Required for static export
  },
  trailingSlash: true,  // Better for static hosting
  experimental: {
    optimizeCss: true,  // CSS optimization
  },
}

module.exports = nextConfig
