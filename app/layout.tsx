import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { generateLocalBusinessSchema, generateOrganizationSchema } from "@/lib/schema"
import { companyInfo } from "@/lib/config"
import { Suspense } from "react"

import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: companyInfo.name,
    template: `%s | ${companyInfo.name}`,
  },
  description: companyInfo.description,
  keywords: [
    "бензиностанция",
    "горива",
    "хотел",
    "Враца",
    "BG OIL",
    "автосервиз",
    "автомивка",
    "бензин",
    "дизел",
    "AdBlue",
    "настаняване",
    "стаи",
    "резервация",
    "24/7",
    "качество",
  ],
  authors: [{ name: companyInfo.name }],
  creator: companyInfo.name,
  publisher: companyInfo.name,
  alternates: {
    canonical: "https://bgoil-vraca.com",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "bg_BG",
    url: "https://bgoil-vraca.com",
    siteName: companyInfo.name,
    title: companyInfo.name,
    description: companyInfo.description,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: companyInfo.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: companyInfo.name,
    description: companyInfo.description,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const localBusinessSchema = generateLocalBusinessSchema()
  const organizationSchema = generateOrganizationSchema()

  return (
    <html lang="bg">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}