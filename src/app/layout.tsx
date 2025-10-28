import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AnalyticsProvider } from '@/lib/analytics'

export const metadata: Metadata = {
  title: 'ToolGalaxyHub - 100+ Free Online Tools',
  description: '100+ free browser-based online tools for files, images, text, code, and SEO. No login required. Fast, secure, and 100% free forever.',
  keywords: ['online tools', 'free tools', 'PDF tools', 'image tools', 'text tools', 'code tools', 'SEO tools'],
  authors: [{ name: 'ToolGalaxyHub' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0a0e27',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://toolgalaxyhub.com',
    siteName: 'ToolGalaxyHub',
    title: 'ToolGalaxyHub - 100+ Free Online Tools',
    description: '100+ free browser-based online tools for files, images, text, code, and SEO. No login required.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ToolGalaxyHub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToolGalaxyHub - 100+ Free Online Tools',
    description: '100+ free browser-based online tools. No login required. Fast, secure, and 100% free forever.',
    images: ['/images/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icons/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="galaxy-bg min-h-screen flex flex-col">
        <AnalyticsProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AnalyticsProvider>
      </body>
    </html>
  )
}
