import type { Metadata, Viewport } from 'next'
import { Outfit, Work_Sans } from 'next/font/google'
import './globals.css'

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
})

const worksans = Work_Sans({
  variable: '--font-worksans',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Card Game Scorer',
  description: 'Track scores for your favorite card games',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${worksans.variable}`}>
        {children}
      </body>
    </html>
  )
}
