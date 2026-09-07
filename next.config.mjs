/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Sanity's CDN already serves correctly sized, auto-format images
    // (see sanity/lib/image.ts), so Next doesn't re-optimize them.
    unoptimized: true,
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
}

export default nextConfig
