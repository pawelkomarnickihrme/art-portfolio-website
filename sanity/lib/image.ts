import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'
import { dataset, isSanityConfigured, projectId } from '../env'

const builder = isSanityConfigured
  ? imageUrlBuilder({ projectId: projectId!, dataset })
  : null

/** Resolves a Sanity image to a CDN URL at the width we actually render. */
export function imageUrl(source: SanityImageSource, width: number) {
  if (!builder) return null
  return builder.image(source).width(width).fit('max').auto('format').url()
}
