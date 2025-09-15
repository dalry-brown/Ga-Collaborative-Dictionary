import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'About - Ga Language Dictionary',
  description: 'Learn about our mission to preserve and expand the Ga language through collaborative digital dictionary building.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}