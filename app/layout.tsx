import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Inter } from "next/font/google"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { generateCombinedSchema } from "@/lib/schema"
import { companyInfo } from "@/lib/config"


import "./globals.css"

// Оптимизирано зареждане на Inter шрифт
const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://bgoil.bg"),
  title: {
    default: companyInfo.name,
    template: `%s | ${companyInfo.name}`,
  },
  description: "BG OIL ВРАЦА - модерна бензиностанция с 24/7 магазин, хотел, автосервиз и автомивка във Враца. Качествени горива (бензин, дизел, AdBlue), комфортни стаи за настаняване и пълен спектър от услуги. Работим 24/7 за вашето удобство.",
  keywords: [
    "бензиностанция Враца",
    "горива Враца",
    "хотел Враца",
    "BG OIL",
    "BG OIL Враца",
    "BG Oil Враца",
    "Bg Oil Враца",
    "бг ойл Враца",
    "бг оил Враца",
    "бг ойл враца",
    "бензиностанция BG OIL",
    "bg oil враца горива",
    "бензиностанция до Враца",

    "автосервиз Враца",
    "автомивка Враца",
    "център за услуги автомобили",
    "24/7 бензиностанция Враца",
    "денонощна бензиностанция Враца",

    "бензин Враца",
    "дизел Враца",
    "качествен бензин",
    "качествен дизел",
    "AdBlue Враца",
    "горива на конкурентни цени",
    "евтини горива Враца",
    "premium горива",

    "хотелски стаи Враца",
    "стаи под наем Враца",
    "настаняване Враца",
    "нощувки Враца",
    "резервация хотел Враца",
    "хотел до бензиностанция",

    "бензиностанция с хотел",
    "бензиностанция с автомивка",
    "бензиностанция с автосервиз",
    "автосервиз и автомивка Враца",

    "удобна локация Враца",
    "спиране за почивка Враца",
    "комплекс услуги за шофьори",
    "пътна отбивка Враца",
    "транспорт и логистика Враца",

    "масла и автоаксесоари Враца",
    "поддръжка на автомобили Враца",
    "бърз автосервиз Враца",

    "бензиностанция 24 часа",
    "денонощни горива",
    "горива за камиони и автомобили"
  ]
  ,
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
    description: "BG OIL ВРАЦА - модерна бензиностанция с 24/7 магазин, хотел, автосервиз и автомивка във Враца. Качествени горива, комфортни стаи и пълен спектър от услуги. Работим 24/7.",
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
    description: "BG OIL ВРАЦА - модерна бензиностанция с 24/7 магазин, хотел, автосервиз и автомивка във Враца. Качествени горива и услуги.",
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
  const combinedSchema = generateCombinedSchema()

  return (
    <html lang="bg" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(combinedSchema),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}

        <Analytics />
      </body>
    </html>
  )
}