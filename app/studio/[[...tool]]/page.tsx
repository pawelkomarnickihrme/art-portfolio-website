import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'
import { isSanityConfigured } from '@/sanity/env'

export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  // Before the Sanity project is connected the Studio cannot boot at all,
  // so say what is missing instead of throwing a 500.
  if (!isSanityConfigured) {
    return (
      <main style={{ padding: '4rem 1.5rem', maxWidth: '38rem', margin: '0 auto', lineHeight: 1.6 }}>
        <h1 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Panel nie jest jeszcze podłączony</h1>
        <p>
          Ustaw <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> w pliku <code>.env.local</code> (lokalnie)
          oraz w ustawieniach projektu na Vercel, a potem uruchom stronę ponownie.
        </p>
        <p style={{ marginTop: '1rem' }}>
          Wzór pliku znajdziesz w <code>.env.local.example</code>. Do czasu konfiguracji strona
          pokazuje przykładowe prace z <code>lib/artworks.ts</code>.
        </p>
      </main>
    )
  }

  return <NextStudio config={config} />
}
