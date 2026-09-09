/**
 * Absolute origin of the live site — needed for canonical URLs, OG tags and
 * the sitemap, none of which may be relative. Set NEXT_PUBLIC_SITE_URL to the
 * custom domain; on Vercel we fall back to the production deployment URL.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')
).replace(/\/$/, '')
