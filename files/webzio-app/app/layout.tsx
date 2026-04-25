import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from 'react-hot-toast'
import SessionWrapper from './SessionWrapper'

const inter = Inter({ subsets: ["latin"] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webrazeo.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Webrazeo — Build Your Business Website in 5 Minutes",
    template: "%s | Webrazeo"
  },
  description: "Create your restaurant, hotel, pharmacy or local business website in 5 minutes. No coding needed. WhatsApp orders, SEO & analytics included. Free plan available.",
  keywords: [
    'website builder', 'restaurant website', 'hotel website', 'local business website',
    'no code website', 'WhatsApp ordering', 'business website free',
    'online menu', 'digital menu', 'pharmacy website', 'gym website', 'salon website'
  ],
  authors: [{ name: 'Webrazeo Team', url: siteUrl }],
  creator: 'Webrazeo',
  publisher: 'Webrazeo',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Webrazeo',
    title: 'Webrazeo — Build Your Business Website in 5 Minutes',
    description: 'Create your restaurant, hotel, or local business website in 5 minutes. Free plan, WhatsApp orders, SEO & analytics included.',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Webrazeo — Website Builder for Local Businesses',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Webrazeo — Build Your Business Website in 5 Minutes',
    description: 'Create your restaurant, hotel, or local business website in 5 minutes. Free forever plan available.',
    images: [`${siteUrl}/og-image.png`],
    creator: '@webrazeo',
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      </head>
      <body className={inter.className}>
        <SessionWrapper>
          {children}
        </SessionWrapper>
        <Toaster position="top-center"/>
      </body>
    </html>
  )
}
