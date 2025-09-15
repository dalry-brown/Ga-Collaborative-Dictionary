import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Contribute - Ga Language Dictionary',
  description: 'Help preserve the Ga language by contributing new words, improving existing entries, and reporting issues.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function ContributeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}