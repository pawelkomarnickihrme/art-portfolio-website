import { CogIcon } from '@sanity/icons/Cog'
import { ThLargeIcon } from '@sanity/icons/ThLarge'
import type { StructureResolver } from 'sanity/structure'

/**
 * Two fixed entries, no "create new document" flows — the artist only ever
 * opens "Prace" or "Tekst na stronie".
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Strona')
    .items([
      S.listItem()
        .title('Prace')
        .id('gallery')
        .icon(ThLargeIcon)
        .child(S.document().schemaType('gallery').documentId('gallery').title('Prace')),
      S.listItem()
        .title('Tekst na stronie')
        .id('siteSettings')
        .icon(CogIcon)
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings').title('Tekst na stronie'),
        ),
    ])
