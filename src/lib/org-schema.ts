/** Site-wide structured data (Organization + WebSite). Rendered once in the root layout. */
export const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "OnlineStore",
      "@id": "https://scentifyfragrances.lk/#organization",
      "name": "Scentify Fragrances",
      "legalName": "Scentify Fragrances (Pvt) Ltd",
      "description": "Scentify Fragrances imports Arabian and designer perfumes directly from the UAE and sells them in Sri Lanka, with prices in LKR, island-wide delivery and Cash on Delivery.",
      "slogan": "Crafted to leave a lasting impression",
      "areaServed": {
        "@type": "Country",
        "name": "Sri Lanka"
      },
      "currenciesAccepted": "LKR",
      "paymentAccepted": "Cash on Delivery, Bank transfer",
      "url": "https://scentifyfragrances.lk",
      "telephone": "+94770055732",
      "email": "order@scentifyfragrances.lk",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "22C Janatha Mawatha, Huludagoda Rd",
        "addressLocality": "Dehiwala-Mount Lavinia",
        "addressCountry": "LK"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "order@scentifyfragrances.lk",
        "telephone": "+94770055732",
        "availableLanguage": [
          "English",
          "Sinhala"
        ],
        "areaServed": "LK",
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "opens": "09:00",
          "closes": "21:00"
        }
      },
      "sameAs": [
        "https://www.instagram.com/__scentify__",
        "https://www.tiktok.com/@__scentify__",
        "https://www.facebook.com/profile.php?id=61591826182325",
        "https://share.google/IGFtl2kijNxxHupAr"
      ]
    },
    {
      "@type": "WebSite",
      "url": "https://scentifyfragrances.lk",
      "name": "Scentify Fragrances",
      "inLanguage": "en-LK",
      "publisher": {
        "@id": "https://scentifyfragrances.lk/#organization"
      }
    }
  ]
} as const;
