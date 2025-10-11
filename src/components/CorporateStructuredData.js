import React from 'react';

const CorporateStructuredData = () => {
  const corporateStructuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Animation d'événements corporatifs - La Soirée du Rire",
    "description": "Services d'animation et d'humour personnalisés pour événements d'entreprise, team building, conférences et soirées corporatives au Québec.",
    "provider": {
      "@type": "Organization",
      "name": "La Soirée du Rire",
      "url": "https://lasoireedurire.ca",
      "logo": "https://lasoireedurire.ca/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-450-991-3336",
        "contactType": "customer service",
        "email": "info@lasoireedurire.ca"
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "CA",
        "addressRegion": "QC"
      }
    },
    "serviceType": "Animation d'événements corporatifs",
    "category": "Entertainment Services",
    "areaServed": {
      "@type": "Place",
      "name": "Québec, Canada"
    },
    "offers": [
      {
        "@type": "Offer",
        "name": "Animation Team Building",
        "description": "Animation personnalisée pour activités de renforcement d'équipe avec humour corporatif adapté",
        "priceRange": "500$ - 5000$+",
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer", 
        "name": "Soirées corporatives",
        "description": "Animation complète pour fêtes d'entreprise, parties de Noël et événements corporatifs",
        "priceRange": "500$ - 5000$+",
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer",
        "name": "Conférences et séminaires",
        "description": "Animation d'événements professionnels avec contenu humoristique adapté au contexte corporatif",
        "priceRange": "500$ - 5000$+",
        "availability": "https://schema.org/InStock"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Services d'animation corporative",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Contenu personnalisé",
            "description": "Humour adapté à votre industrie et culture d'entreprise"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "Groupes de toutes tailles",
            "description": "Animation pour 20 à 500+ personnes"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Lieux flexibles", 
            "description": "Salles de conférence, restaurants, espaces événementiels"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Animation complète",
            "description": "Comédiens professionnels + équipement technique"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "47",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Marie Dubois"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Notre équipe n'avait jamais ri autant lors d'un événement corporatif ! La Soirée du Rire a su adapter son humour à notre contexte professionnel tout en gardant l'ambiance décontractée qu'on recherchait pour notre team building."
      }
    ],
    "keywords": [
      "animation corporative",
      "événements d'entreprise", 
      "team building",
      "soirée corporative",
      "humour d'entreprise",
      "animation conférence",
      "événement professionnel",
      "comédien corporatif",
      "animation Québec",
      "fête d'entreprise"
    ],
    "audience": {
      "@type": "Audience",
      "audienceType": "Entreprises et organisations"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(corporateStructuredData, null, 2)
      }}
    />
  );
};

export default CorporateStructuredData;
