import { defineQuery } from 'next-sanity'

export const galleryQuery = defineQuery(`
  *[_id == "gallery"][0].items[]{
    _key,
    title,
    widthCm,
    heightCm,
    alt,
    marginTop,
    marginBottom,
    offsetX,
    image,
    "ratio": image.asset->metadata.dimensions.aspectRatio
  }
`)

export const siteSettingsQuery = defineQuery(`
  *[_id == "siteSettings"][0]{
    siteTitle,
    bio,
    footerNote
  }
`)
