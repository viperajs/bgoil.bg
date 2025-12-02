import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { generateLocalBusinessSchema, generateOrganizationSchema } from "@/lib/schema"
import { companyInfo } from "@/lib/config"

import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://bgoil.bg"),
  title: {
    default: companyInfo.name,
    template: `%s | ${companyInfo.name}`,
  },
  description: "BG OIL - модерна бензиностанция с 24/7 магазин, хотел, автосервиз и автомивка. Качествени горива (бензин, дизел, AdBlue), комфортни стаи за настаняване и пълен спектър от услуги. Работим 24/7 за вашето удобство.",
  keywords: [
    "бензиностанция Враца",
    "горива Враца",
    "хотел Враца",
    "BG OIL",
    "автосервиз",
    "автомивка",
    "бензин",
    "дизел",
    "AdBlue",
    "настаняване",
    "стаи",
    "резервация хотел Враца",
    "24/7 бензиностанция",
    "качествени горива",
    "бензиностанция с хотел",
    "автосервиз и автомивка",
    "горива на конкурентни цени",
    "хотелски стаи Враца",
    "бензиностанция 24 часа",
  ],
  authors: [{ name: companyInfo.name }],
  creator: companyInfo.name,
  publisher: companyInfo.name,
  alternates: {
    canonical: "https://bgoil.bg",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "bg_BG",
    url: "https://bgoil.bg",
    siteName: companyInfo.name,
    title: `${companyInfo.name} - ${companyInfo.slogan}`,
    description: "BG OIL - модерна бензиностанция с 24/7 магазин, хотел, автосервиз и автомивка. Качествени горива, комфортни стаи и пълен спектър от услуги във Враца. Работим 24/7.",
    images: [
      {
        url: "https://bgoil.bg/background.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: `${companyInfo.name} - Бензиностанция, хотел и автосервиз във Враца`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${companyInfo.name} - ${companyInfo.slogan}`,
    description: "BG OIL - модерна бензиностанция с 24/7 магазин, хотел, автосервиз и автомивка. Качествени горива и услуги във Враца.",
    images: ["https://bgoil.bg/background.png"],
    creator: "@bgoil",
  },  
  icons: {
    icon: [
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
  },
  manifest: "/site.webmanifest",
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
  generator: "Next.js"
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
      <body className="font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  )
}