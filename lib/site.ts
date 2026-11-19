/**
 * Absolute origin of the live site — needed for canonical URLs, OG tags and
 * the sitemap, none of which may be relative. NEXT_PUBLIC_SITE_URL overrides.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sanka-art.com'
).replace(/\/$/, '')
