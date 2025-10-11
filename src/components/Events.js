import React from 'react';

const Events = ({ onEventsLoad }) => {
  const events = [
    {
      day: "20",
      month: "SEPT",
      title: "ÉPISODE 1 - SAISON 4",
      description: "On revient en force ! 🔥 La saison 4 de La Soirée du Rire débarque à Granby avec un line-up de malade au Social Bar et Cie. Des humoristes québécois qui vont vous faire péter de rire ! Des surprises à en perdre la tête, pis on vous garantit que vous allez en manger une maudite bonne !",
      time: "20h00",
      location: "Le Social Bar et Cie",
      facebookUrl: "https://www.facebook.com/share/1FWLB3CGjy/",
      guests: [
        { name: "Sam Hébert", url: "https://www.instagram.com/samheberthumoriste/" },
        { name: "Will Murphy", url: "https://www.instagram.com/wllmurphy/" },
        { name: "Stephane Fallu", url: "https://www.facebook.com/fallusinant" }
      ],
      isPast: true,  // Set to true to grey out this event
      showCalendarButton: false,
      isNext: false,  // Set to true to highlight this as the next event
      calendarDate: "2024-09-20", // Date for calendar (YYYY-MM-DD format)
      calendarTime: "20:00", // Time for calendar (24h format)
      calendarDuration: "2h" // Duration for calendar
    },
    {
      day: "11",
      month: "OCT",
      title: "ÉPISODE 2 - SAISON 4",
      description: "On a encore des trucs bizarres ! 😈 Après le court métrage de Carl (qui va vous faire capoter), on a un mystère qui va vous faire péter... de rire ! Des humoristes québécois qui vont vous faire rire aux éclats au Social Bar et Cie. Une soirée de malade qui va vous faire oublier que c'est l'automne !",
      time: "20h00",
      location: "Le Social Bar et Cie",
      facebookUrl: "https://www.facebook.com/share/17MsjAdxdH/",
      guests: [
        { name: "Rolly Assal", url: "https://www.instagram.com/rollyassal/" },
        { name: "Joe Guerin", url: "https://www.instagram.com/joeguerinn/" },
        { name: "???", url: "https://media.istockphoto.com/id/483558444/fr/photo/de-ch%C3%A8vre.jpg?s=612x612&w=0&k=20&c=yt7YGp6upLi_hDBYtHyhqxCyTYoY0je6oGoblmsd2L4=" }
      ],
      isPast: false,  // Set to true to grey out this event
      isNext: true,    // Set to true to highlight this as the next event
      calendarDate: "2024-10-11", // Date for calendar (YYYY-MM-DD format)
      calendarTime: "20:00", // Time for calendar (24h format)
      calendarDuration: "2h" // Duration for calendar
    },
    {
      day: "8",
      month: "NOV",
      title: "ÉPISODE 3 - SAISON 4",
      description: "C'est déjà la dernière de 2024 ! 🎅🏻 On finit l'année en beauté avec des humoristes québécois qui vont vous faire péter de rire au Social Bar et Cie. On va se souhaiter Joyeux Noël deux mois d'avance pis on va se gâter comme des rois ! Des fous rires garantis ou on vous rembourse... en bières !",
      time: "20h00",
      location: "Le Social Bar et Cie",
      facebookUrl: "https://www.facebook.com/lsdrg",
      guests: [
        { name: "Jacob Ospian", url: "https://www.instagram.com/jacobospian/" },
        { name: "Mathieu Bougie", url: "https://www.instagram.com/mathbougie/" },
        { name: "Pier-Luc Pomerleau", url: "https://www.facebook.com/PLPomerleau" }
      ],
      isPast: false,  // Set to true to grey out this event
      isNext: false,   // Set to true to highlight this as the next event
      calendarDate: "2024-11-08", // Date for calendar (YYYY-MM-DD format)
      calendarTime: "20:00", // Time for calendar (24h format)
      calendarDuration: "2h" // Duration for calendar
    },
    {
      day: "10",
      month: "JAN",
      title: "ÉPISODE 4 - SAISON 4",
      description: "On est en 2025 ! 😅 Nouvelle année, nouveaux fous rires avec des humoristes québécois qui vont vous faire péter de rire au Social Bar et Cie. C'est le temps des résolutions... ou pas ! (On sait ben que vous allez les briser anyway) Une soirée de malade pour bien commencer l'année pis oublier que vous avez encore pas tenu vos promesses !",
      time: "20h00",
      location: "Le Social Bar et Cie",
      facebookUrl: "https://www.facebook.com/lsdrg",
      guests: [
        { name: "À déterminer", url: "" },
        { name: "À déterminer", url: "" },
        { name: "À déterminer", url: "" }
      ],
      isPast: false,  // Set to true to grey out this event
      isNext: false,   // Set to true to highlight this as the next event
      calendarDate: "2025-01-10", // Date for calendar (YYYY-MM-DD format)
      calendarTime: "20:00", // Time for calendar (24h format)
      calendarDuration: "2h" // Duration for calendar
    },
    {
      day: "7",
      month: "FEV",
      title: "ÉPISODE 5 - SAISON 4",
      description: "Grosse soirée encore une fois ! 🔥 Des têtes d'affiche nationales pis des humoristes québécois de malade au Social Bar et Cie. Un événement de malade qui va vous faire péter de rire ! Pis si vous manquez ça, on va vous faire sentir coupable jusqu'à la prochaine fois !",
      time: "20h00",
      location: "Le Social Bar et Cie",
      facebookUrl: "https://www.facebook.com/lsdrg",
      guests: [
        { name: "À déterminer", url: "" },
        { name: "À déterminer", url: "" },
        { name: "À déterminer", url: "" }
      ],
      isPast: false,  // Set to true to grey out this event
      isNext: false,   // Set to true to highlight this as the next event
      calendarDate: "2025-02-07", // Date for calendar (YYYY-MM-DD format)
      calendarTime: "20:00", // Time for calendar (24h format)
      calendarDuration: "2h" // Duration for calendar
    },
    {
      day: "14",
      month: "MARS",
      title: "ÉPISODE 6 - SAISON 4",
      description: "On est en mars pis on a encore des trucs de malade ! 😂 Des humoristes québécois qui vont vous faire péter de rire au Social Bar et Cie. Une soirée de comédie stand-up exceptionnelle qui va vous faire oublier que l'hiver finit jamais ! Venez rire avec nous, pis si vous riez pas, on vous rembourse... en jokes !",
      time: "20h00",
      location: "Le Social Bar et Cie",
      facebookUrl: "https://www.facebook.com/lsdrg",
      guests: [
        { name: "À déterminer", url: "" },
        { name: "À déterminer", url: "" },
        { name: "À déterminer", url: "" }
      ],
      isPast: false,  // Set to true to grey out this event
      isNext: false,   // Set to true to highlight this as the next event
      calendarDate: "2025-03-14", // Date for calendar (YYYY-MM-DD format)
      calendarTime: "20:00", // Time for calendar (24h format)
      calendarDuration: "2h" // Duration for calendar
    },
    {
      day: "18",
      month: "AVRIL",
      title: "ÉPISODE 7 - SAISON 4",
      description: "C'est le printemps ! 🌸 (Enfin, on espère !) Des humoristes québécois exceptionnels qui vont vous faire péter de rire au Social Bar et Cie. C'est le temps des résolutions... ou pas ! (On sait ben que vous les avez déjà brisées) Une soirée de malade pour célébrer que la neige fond enfin... ou pas ! 😅",
      time: "20h00",
      location: "Le Social Bar et Cie",
      facebookUrl: "https://www.facebook.com/lsdrg",
      guests: [
        { name: "À déterminer", url: "" },
        { name: "À déterminer", url: "" },
        { name: "À déterminer", url: "" }
      ],
      isPast: false,  // Set to true to grey out this event
      isNext: false,   // Set to true to highlight this as the next event
      calendarDate: "2025-04-18", // Date for calendar (YYYY-MM-DD format)
      calendarTime: "20:00", // Time for calendar (24h format)
      calendarDuration: "2h" // Duration for calendar
    }
  ];

  // Pass events data to parent component for structured data
  React.useEffect(() => {
    if (onEventsLoad) {
      onEventsLoad(events);
    }
  }, [events, onEventsLoad]);

  // Manual control flags - you can easily toggle these to control which events are greyed out or highlighted
  // Simply change true/false values in the events array above

  // Calendar functionality - Apple devices only
  const addToCalendar = (event, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isMac = /macintosh|mac os x/.test(userAgent);
    
    // Only work on Apple devices
    if (!isIOS && !isMac) {
      alert('Cette fonctionnalité est disponible uniquement sur les appareils Apple.');
      return;
    }
    
    const startDate = new Date(`${event.calendarDate}T${event.calendarTime}:00`);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours
    
    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(`${event.description}\n\nInvités: ${event.guests.map(g => g.name).join(', ')}\n\nLien Facebook: ${event.facebookUrl}`);
    const location = encodeURIComponent(event.location);
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    
    // Apple Calendar (ICS file)
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//La Soirée du Rire//Event//EN
BEGIN:VEVENT
UID:${Date.now()}@lsdrg.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${start}
DTEND:${end}
SUMMARY:${event.title}
DESCRIPTION:${event.description}\\n\\nInvités: ${event.guests.map(g => g.name).join(', ')}\\n\\nLien Facebook: ${event.facebookUrl}
LOCATION:${event.location}
URL:${event.facebookUrl}
END:VEVENT
END:VCALENDAR`;
    
    // Create and download ICS file for Apple Calendar
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="evenements" className="events-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Prochains Spectacles d'Humour à Granby</h2>
          <p className="section-description">
            Découvrez notre programmation de spectacles d'humour mensuels au Social Bar et Cie de Granby. 
            Des humoristes québécois de talent vous attendent pour des soirées mémorables !
          </p>
        </div>
        <div className="events-grid">
          {events.map((event, index) => {
            return (
              <div 
                key={index} 
                className={`event-card-link ${event.isPast ? 'past-event' : ''} ${event.isNext ? 'next-event' : ''}`}
              >
                <div className="event-card tilted-card-figure">
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
                      <div className="event-guests">
                        <h4 className="guests-title">Invités:</h4>
                        <div className="guests-list">
                          {event.guests.map((guest, guestIndex) => (
                            <a
                              key={guestIndex}
                              href={guest.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="guest-name"
                            >
                              {guest.name}
                            </a>
                          ))}
                        </div>
                      </div>
                      <div className="event-details">
                        <span className="event-time">{event.time}</span>
                        <span className="event-location">{event.location}</span>
                      </div>
                      <div className="event-actions">
                        <button 
                          className="calendar-btn"
                          onClick={(e) => addToCalendar(event, e)}
                          title="Ajouter au calendrier (Apple uniquement)"
                        >
                          Ajouter au calendrier
                        </button>
                        <a
                          href={event.facebookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="facebook-btn"
                          title="Voir l'événement sur Facebook"
                        >
                          {event.isNext ? "ÉVÉNEMENT" : "Facebook"}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Events;
