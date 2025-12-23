import { companyInfo, contacts } from "./config"

export function generateProductSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Горива BG OIL ВРАЦА",
    description: "Висококачествени горива - бензин, дизел, AdBlue от BG OIL ВРАЦА",
    brand: {
      "@type": "Brand",
      name: "BG OIL ВРАЦА",
    },
    category: "Automotive Fuel",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "BGN",
      availability: "https://schema.org/InStock",
    },
  }
}


export function generateBreadcrumbListSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}


export function generateReviewSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "LocalBusiness",
      name: companyInfo.name,
      "@id": "https://bgoil.bg",
    },
    author: {
      "@type": "Organization",
      name: companyInfo.name,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: "4.8",
      bestRating: "5",
      worstRating: "1",
    },
  }
}

export function generateCombinedSchema() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "GasStation",
      name: companyInfo.name,
      description: companyInfo.description,
      image: "https://bgoil.bg/background.png",
      address: {
        "@type": "PostalAddress",
        streetAddress: contacts.address,
        addressLocality: "Враца",
        postalCode: "3000",
        addressCountry: "BG",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "43.220077",
        longitude: "23.558262",
      },
      telephone: contacts.phoneMain,
      email: contacts.email,
      url: "https://bgoil.bg",
      openingHours: "Mo-Su 00:00-23:59",
      paymentAccepted: ["Cash", "Credit Card", "Debit Card"],
      priceRange: "$$",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "127",
        bestRating: "5",
        worstRating: "1",
      },
      amenityFeature: [
        { "@type": "LocationFeatureSpecification", name: "Parking", value: true },
        { "@type": "LocationFeatureSpecification", name: "24/7 Store", value: true },
        { "@type": "LocationFeatureSpecification", name: "Car Wash", value: true },
        { "@type": "LocationFeatureSpecification", name: "Auto Service", value: true },
        { "@type": "LocationFeatureSpecification", name: "WiFi", value: true },
      ],
      servesCuisine: [],
      hasMap: contacts.mapsLink,
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: companyInfo.name,
      url: "https://bgoil.bg",
      logo: {
        "@type": "ImageObject",
        url: "https://bgoil.bg/bg-oil-logo.webp",
        name: companyInfo.name,
      },
      description: companyInfo.description,
      address: {
        "@type": "PostalAddress",
        streetAddress: contacts.address,
        addressLocality: "Враца",
        postalCode: "3000",
        addressCountry: "BG",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: contacts.phoneMain,
          contactType: "customer service",
          availableLanguage: "Bulgarian",
          areaServed: "BG",
        },
        {
          "@type": "ContactPoint",
          telephone: contacts.servicePhone,
          contactType: "technical support",
          availableLanguage: "Bulgarian",
        },
      ],
      sameAs: ["https://www.facebook.com/bgoil-vraca", "https://www.instagram.com/bgoil-vraca"],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "127",
        bestRating: "5",
        worstRating: "1",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Къде се намира BG OIL ВРАЦА?",
          acceptedAnswer: {
            "@type": "Answer",
            text: `${companyInfo.name} се намира в гр. Враца 3000, на адрес ${contacts.address}. Работим 24/7 за вашето удобство.`,
          },
        },
        {
          "@type": "Question",
          name: "Какво горива предлага BG OIL ВРАЦА?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "BG OIL ВРАЦА предлага висококачествени горива: бензин А95, дизел, ГПБ и AdBlue на конкурентни цени с отстъпки за картови клиенти.",
          },
        },
        {
          "@type": "Question",
          name: "Има ли отстъпки за горива в BG OIL ВРАЦА?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Да, BG OIL ВРАЦА предлага карта за лоялност с отстъпки при всяко зареждане. Получете вашата карта на място в бензиностанцията.",
          },
        },
        {
          "@type": "Question",
          name: "Какви услуги предлага BG OIL ВРАЦА?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "BG OIL ВРАЦА предлага пълен спектър от услуги: 24/7 магазин, автосервиз, автомивка, EasyPay каса и качествени горива.",
          },
        },
      ],
    },
  ]
}
