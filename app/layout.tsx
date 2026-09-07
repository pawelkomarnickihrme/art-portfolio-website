import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Archivo } from 'next/font/google'
import './globals.css'

// One family, used at both ends of its width axis: wdth 125 for the wall text,
// wdth 100 for everything that is read rather than seen.
const archivo = Archivo({
  subsets: ['latin', 'latin-ext'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'sanka',
  description: 'sanka — abstract, vivid, graphic paintings.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
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
    <html lang="en" data-wall="black" className={`${archivo.variable} bg-background`}>
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
