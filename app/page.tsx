import { Gallery } from '@/components/gallery'
import { WallToggle } from '@/components/wall-toggle'
import { getSiteSettings } from '@/lib/content'

export default async function Page() {
  const { siteTitle, bio, footerNote } = await getSiteSettings()

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="mx-auto w-full max-w-[1320px] px-6 pt-20 md:px-12 md:pt-28">
        <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-6">
          <h1 className="wall-text">{siteTitle}</h1>
          <div className="shrink-0 pt-2">
            <WallToggle />
          </div>
        </div>

        <div className="mt-12 max-w-[58ch] space-y-5 text-[1.0625rem] leading-[1.55]">
          {bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-14 flex items-center gap-5">
          <span className="scale-bar" aria-hidden="true" />
          <p className="max-w-[34ch] text-[0.875rem] leading-snug text-muted-foreground">
            Works are shown to scale. This bar is 10 centimetres.
          </p>
        </div>
      </header>

      <Gallery />

      <footer className="mx-auto w-full max-w-[1320px] px-6 md:px-12">
        <div className="border-t border-[var(--hairline)] pb-24 pt-16 md:pb-32 md:pt-20">
          <p className="max-w-[52ch] text-[1.0625rem] leading-[1.55]">{footerNote}</p>
          <p className="wall-text-closing mt-16">{siteTitle}</p>
        </div>
      </footer>
    </main>
  )
}
