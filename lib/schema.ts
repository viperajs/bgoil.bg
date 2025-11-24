import { companyInfo, contacts, hotelRooms } from "./config"

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "GasStation",
    name: companyInfo.name,
    description: companyInfo.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: contacts.address,
      addressLocality: "Враца",
      postalCode: "3000",
      addressCountry: "BG",
    },
    telephone: contacts.phoneMain,
    email: contacts.email,
    openingHours: "Mo-Su 00:00-23:59",
    paymentAccepted: ["Cash", "Credit Card"],
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Parking" },
      { "@type": "LocationFeatureSpecification", name: "24/7 Store" },
      { "@type": "LocationFeatureSpecification", name: "Car Wash" },
      { "@type": "LocationFeatureSpecification", name: "Auto Service" },
    ],
  }
}

export function generateHotelSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: `${companyInfo.name} - Хотел`,
    description: "Комфортен хотел с различни типове стаи във Враца",
    address: {
      "@type": "PostalAddress",
      streetAddress: contacts.address,
      addressLocality: "Враца",
      postalCode: "3000",
      addressCountry: "BG",
    },
    telephone: contacts.hotelPhone,
    email: contacts.email,
    priceRange: `${Math.min(...hotelRooms.map((r) => r.price))}-${Math.max(...hotelRooms.map((r) => r.price))} лв`,
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Free Parking" },
      { "@type": "LocationFeatureSpecification", name: "24/7 Reception" },
    ],
  }
}

export function generateProductSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Горива BG OIL",
    description: "Висококачествени горива - бензин, дизел, AdBlue",
    brand: {
      "@type": "Brand",
      name: "BG OIL",
    },
    category: "Automotive Fuel",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "BGN",
      availability: "https://schema.org/InStock",
    },
  }
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: companyInfo.name,
    url: "https://bgoil.com",
    logo: "https://bgoil.com/bg-oil-logo.webp",
    description: companyInfo.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: contacts.address,
      addressLocality: "Враца",
      postalCode: "3000",
      addressCountry: "BG",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: contacts.phoneMain,
      contactType: "customer service",
      availableLanguage: "Bulgarian",
    },
    sameAs: ["https://www.facebook.com/bgoil-vraca", "https://www.instagram.com/bgoil-vraca"],
  }
}
