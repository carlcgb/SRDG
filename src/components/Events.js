import React from 'react';

const Events = () => {
  const events = [
    {
      day: "15",
      month: "MARS",
      title: "Soirée Stand-up",
      description: "Une soirée remplie de comédiens locaux et d'humoristes invités.",
      time: "20h00",
      location: "Centre Culturel de Granby"
    },
    {
      day: "22",
      month: "MARS",
      title: "Nuit de l'Impro",
      description: "Spectacle d'improvisation interactif avec le public.",
      time: "19h30",
      location: "Théâtre de Granby"
    },
    {
      day: "29",
      month: "MARS",
      title: "Comedy Night",
      description: "Soirée bilingue avec des humoristes francophones et anglophones.",
      time: "20h30",
      location: "Bar Le Rire"
    },
    {
      day: "05",
      month: "AVR",
      title: "Open Mic",
      description: "Scène ouverte pour tous les talents comiques de la région.",
      time: "19h00",
      location: "Café L'Éclat de Rire"
    },
    {
      day: "12",
      month: "AVR",
      title: "Festival du Rire",
      description: "Grand festival de 3 jours avec des têtes d'affiche nationales.",
      time: "Toute la journée",
      location: "Parc de Granby"
    },
    {
      day: "19",
      month: "AVR",
      title: "Soirée Familiale",
      description: "Humour adapté à toute la famille, des enfants aux grands-parents.",
      time: "14h00",
      location: "Salle Communautaire"
    }
  ];

  return (
    <section id="evenements" className="events-section">
      <div className="container">
        <h2 className="section-title">Prochains Événements</h2>
        <div className="events-grid">
          {events.map((event, index) => (
            <div key={index} className="event-card tilted-card-figure">
              <div className="tilted-card-inner">
                <div className="event-card-content">
                  <div className="event-date">
                    <span className="day">{event.day}</span>
                    <span className="month">{event.month}</span>
                  </div>
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-description">
                    {event.description}
                  </p>
                  <div className="event-details">
                    <span className="event-time">{event.time}</span>
                    <span className="event-location">{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;
