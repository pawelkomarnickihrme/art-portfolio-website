import type { SchemaTypeDefinition } from 'sanity'
import { artwork } from './artwork'
import { gallery } from './gallery'
import { siteSettings } from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [gallery, siteSettings, artwork],
}
