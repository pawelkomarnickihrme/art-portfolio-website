import type { SanityImageSource } from '@sanity/image-url'
import { client } from '@/sanity/lib/client'
import { imageUrl } from '@/sanity/lib/image'
import { galleryQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import {
  defaultSiteSettings,
  LIGHTBOX_PX,
  MAX_COLUMN_PX,
  PX_PER_CM,
  type Artwork,
  type SiteSettings,
} from './artworks'

// How long a published change can take to appear on the live site.
const REVALIDATE_SECONDS = 60

type GalleryItem = {
  _key: string
  title?: string
  widthCm?: number
  heightCm?: number
  alt?: string
  marginTop?: number
  marginBottom?: number
  offsetX?: number
  image?: SanityImageSource
  ratio?: number
}

/** The widest the browser will ever paint this piece, doubled for retina screens. */
function requestWidth(wcm: number) {
  return Math.round(Math.min(wcm * PX_PER_CM, MAX_COLUMN_PX) * 2)
}

export async function getArtworks(): Promise<Artwork[]> {
  // No Sanity project yet — nothing to hang, but the page still builds.
  if (!client) return []

  const items = await client.fetch<GalleryItem[] | null>(
    galleryQuery,
    {},
    { next: { revalidate: REVALIDATE_SECONDS } },
  )

  return (items ?? []).flatMap((item) => {
    const wcm = item.widthCm ?? 0
    const hcm = item.heightCm ?? 0
    // A half-filled entry in the Studio must not break the page — skip it.
    if (!item.image || !wcm || !hcm) return []

    const src = imageUrl(item.image, requestWidth(wcm))
    if (!src) return []

    return [
      {
        src,
        full: imageUrl(item.image, LIGHTBOX_PX) ?? src,
        title: item.title ?? '',
        wcm,
        hcm,
        ratio: item.ratio && item.ratio > 0 ? item.ratio : undefined,
        alt: item.alt ?? item.title ?? '',
        mt: item.marginTop ?? 0,
        mb: item.marginBottom ?? undefined,
        dx: item.offsetX ?? 0,
      },
    ]
  })
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!client) return defaultSiteSettings

  const settings = await client.fetch<{
    siteTitle?: string
    bio?: string
    footerNote?: string
  } | null>(siteSettingsQuery, {}, { next: { revalidate: REVALIDATE_SECONDS } })

  return {
    siteTitle: settings?.siteTitle || defaultSiteSettings.siteTitle,
    // In the Studio the bio is one text box; a blank line starts a new paragraph.
    bio: settings?.bio
      ? settings.bio.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
      : defaultSiteSettings.bio,
    footerNote: settings?.footerNote || defaultSiteSettings.footerNote,
  }
}
