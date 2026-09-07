export type Artwork = {
  src: string
  /** larger source for the lightbox, where a work is looked at up close */
  full?: string
  title: string
  /** real painting width in centimeters */
  wcm: number
  /** real painting height in centimeters */
  hcm: number
  /**
   * Width over height of the photograph itself. The frame is cut to this, so a
   * photo is never cropped; wcm still sets how large the work hangs. Without
   * it the frame falls back to the painting's own proportions.
   */
  ratio?: number
  alt: string
  /** empty space above the piece, in px — larger values push it further from what's above */
  mt?: number
  /** empty space below the piece, in px */
  mb?: number
  /** horizontal nudge within its column, in px (positive = right, negative = left) */
  dx?: number
}

export type SiteSettings = {
  siteTitle: string
  /** one entry per paragraph */
  bio: string[]
  footerNote: string
}

/** Stands in for a field the artist has left empty in the Studio. */
export const defaultSiteSettings: SiteSettings = {
  siteTitle: 'sanka',
  bio: [
    'Abstract paintings built from vivid, saturated colour — hard-edged in some works, poured and translucent in others.',
    'Replace this with a line about your practice, your materials, or what the work is after. You can edit it in the panel at /studio.',
  ],
  footerNote: 'Every work here is available. Write if you would like to see one in person.',
}

/**
 * Pixels per centimeter at the widest breakpoint, matching --ppc in
 * globals.css. Layout reads --ppc directly; this copy exists so we can ask
 * Sanity's CDN for an image no larger than the page will ever paint.
 */
export const PX_PER_CM = 11

/** Widest a work ever gets: a 50cm piece in the 1240px, two-column hang. */
export const MAX_COLUMN_PX = 580

/**
 * Widest the lightbox ever asks for. Well past any screen, because zooming in
 * is the point — Sanity's `fit: max` never upscales past the original file.
 */
export const LIGHTBOX_PX = 2600
