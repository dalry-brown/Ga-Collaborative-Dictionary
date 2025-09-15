import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NextAuthProvider from "@/components/providers/session-provider"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ga Language Dictionary - Collaborative Language Preservation',
  description: 'Explore, contribute to, and help preserve the Ga language through our collaborative digital dictionary. Search thousands of Ga words with meanings, pronunciations, and usage examples.',
  keywords: 'Ga language, Ghana, dictionary, linguistics, African languages, language preservation',
  authors: [{ name: 'Ga Dictionary Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Ga Language Dictionary',
    description: 'Collaborative platform for preserving and learning the Ga language of Ghana',
    type: 'website',
    locale: 'en_US',
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth h-full">
      <body className={`${inter.className} antialiased h-full`}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  )
}