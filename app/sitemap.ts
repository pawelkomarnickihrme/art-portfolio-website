import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'

// ponytail: one page, one entry. Grow this when there are real routes.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 }]
}
