import React from 'react';

const StructuredData = ({ events }) => {
  // Filtrer les événements futurs pour les données structurées
  const futureEvents = events.filter(event => !event.isPast);
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    "name": "La Soirée du Rire de Granby",
    "description": "Série de spectacles d'humour mensuels à Granby avec les meilleurs humoristes du Québec",
    "url": "https://lasoireedurire.ca",
    "organizer": {
      "@type": "Organization",
      "name": "La Soirée du Rire de Granby",
      "url": "https://lasoireedurire.ca"
    },
    "location": {
      "@type": "Place",
      "name": "Le Social Bar et Cie",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Granby",
        "addressRegion": "QC",
        "addressCountry": "CA"
      }
    },
    "event": futureEvents.map(event => {
      const eventDate = new Date(`${event.calendarDate}T${event.calendarTime}:00`);
      const endDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000); // 2 heures plus tard
      
      return {
        "@type": "Event",
        "name": event.title,
        "description": event.description,
        "startDate": eventDate.toISOString(),
        "endDate": endDate.toISOString(),
        "location": {
          "@type": "Place",
          "name": event.location,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Granby",
            "addressRegion": "QC",
            "addressCountry": "CA"
          }
        },
        "performer": event.guests.filter(guest => guest.name !== "À déterminer").map(guest => ({
          "@type": "Person",
          "name": guest.name,
          "url": guest.url || ""
        })),
        "keywords": "spectacle humour Granby, comédie stand-up, humoristes autant de la relève que des vétérans, La Soirée du Rire, Social Bar et Cie, événement Granby",
        "audience": {
          "@type": "Audience",
          "audienceType": "Adults"
        },
        "offers": {
          "@type": "Offer",
          "url": event.facebookUrl,
          "availability": "https://schema.org/InStock",
          "price": "0",
          "priceCurrency": "CAD"
        }
      };
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData, null, 2) }}
    />
  );
};

export default StructuredData;
