import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Archivo } from 'next/font/google'
import { siteUrl } from '@/lib/site'
import './globals.css'

// One family, used at both ends of its width axis: wdth 125 for the wall text,
// wdth 100 for everything that is read rather than seen.
const archivo = Archivo({
  subsets: ['latin', 'latin-ext'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
})

// Title and description are overridden per-render from the Studio in
// app/page.tsx; these stay as the fallback for every other route.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'sanka',
  description: 'sanka — abstract, vivid, graphic paintings.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'sanka',
    url: '/',
    title: 'sanka',
    description: 'sanka — abstract, vivid, graphic paintings.',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: '#000000',
}

// Applies the remembered wall before first paint, so switching to white does
// not flash black on the way in.
const REMEMBERED_WALL = `try{var w=localStorage.getItem('wall');if(w==='white'){document.documentElement.dataset.wall='white';document.querySelector('meta[name="theme-color"]').content='#ffffff'}}catch(e){}`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-wall="black"
      className={`${archivo.variable} bg-background`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: REMEMBERED_WALL }} />
      </head>
      <body className="font-sans">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
