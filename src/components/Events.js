import React, { useState } from 'react';

const Events = () => {
  // State to control calendar button visibility
  const [showCalendarButton, setShowCalendarButton] = useState(true);
  const events = [
    {
      day: "20",
      month: "SEPT",
      title: "ÉPISODE 1 - SAISON 4",
      description: "C'est le lancement officiel de la saison 4!! Plein de surprise et un line-up en feux!!! 🔥",
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
      description: "Après la diffusion du court métrage de Carl avant le spectacle, le 11 on a un autre mystère à découvrir!",
      time: "20h00",
      location: "Le Social Bar et Cie",
      facebookUrl: "https://www.facebook.com/events/your-event-id-2",
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
      description: "C'est la dernière de 2025! On va se souhaiter Joyeux Noël deux mois d'avance  🎅🏻",
      time: "20h00",
      location: "Le Social Bar et Cie",
      facebookUrl: "https://www.facebook.com/events/your-event-id-3",
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
      description: "C'est la première de 2026!!! C'est le temps des résolutions... ou pas 😅",
      time: "20h00",
      location: "Le Social Bar et Cie",
      facebookUrl: "https://www.facebook.com/lsdrg",
      guests: [
        { name: "À déterminer", url: "#" },
        { name: "À déterminer", url: "#" },
        { name: "À déterminer", url: "#" }
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
      description: "Grand festival de 3 jours avec des têtes d'affiche nationales.",
      time: "20h00",
      location: "Le Social Bar et Cie",
      facebookUrl: "https://www.facebook.com/lsdrg",
      guests: [
        { name: "À déterminer", url: "#" },
        { name: "À déterminer", url: "#" },
        { name: "À déterminer", url: "#" }
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
      description: "Humour adapté à toute la famille, des enfants aux grands-parents.",
      time: "20h00",
      location: "Le Social Bar et Cie",
      facebookUrl: "https://www.facebook.com/events/your-event-id-6",
      guests: [
        { name: "À déterminer", url: "#" },
        { name: "À déterminer", url: "#" },
        { name: "À déterminer", url: "#" }
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
      description: "C'est la première de 2026!!! C'est le temps des résolutions... ou pas 😅",
      time: "20h00",
      location: "Le Social Bar et Cie",
      facebookUrl: "https://www.facebook.com/lsdrg",
      guests: [
        { name: "À déterminer", url: "#" },
        { name: "À déterminer", url: "#" },
        { name: "À déterminer", url: "#" }
      ],
      isPast: false,  // Set to true to grey out this event
      isNext: false,   // Set to true to highlight this as the next event
      calendarDate: "2025-04-18", // Date for calendar (YYYY-MM-DD format)
      calendarTime: "20:00", // Time for calendar (24h format)
      calendarDuration: "2h" // Duration for calendar
    }
  ];

  // Manual control flags - you can easily toggle these to control which events are greyed out or highlighted
  // Simply change true/false values in the events array above

  // Calendar functionality
  const addToCalendar = (event, e) => {
    e.preventDefault();
    e.stopPropagation();
    
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
    
    // Google Calendar URL
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
    
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
    
    // Create a modal or dropdown to let user choose calendar type
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isMac = /macintosh|mac os x/.test(userAgent);
    
    if (isIOS || isMac) {
      // For Apple devices, offer both options
      const choice = window.confirm(
        'Choisissez votre calendrier:\n\nOK = Apple Calendar\nAnnuler = Google Calendar'
      );
      
      if (choice) {
        // Apple Calendar - create ICS file
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${event.title.replace(/\s+/g, '_')}.ics`;
        link.click();
      } else {
        // Google Calendar
        window.open(googleUrl, '_blank');
      }
    } else {
      // For other devices, default to Google Calendar
      window.open(googleUrl, '_blank');
    }
  };

  return (
    <section id="evenements" className="events-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Prochains Événements</h2>
          <div className="calendar-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={showCalendarButton}
                onChange={(e) => setShowCalendarButton(e.target.checked)}
                className="toggle-input"
              />
              <span className="toggle-slider"></span>
              <span className="toggle-text">Bouton calendrier</span>
            </label>
          </div>
        </div>
        <div className="events-grid">
          {events.map((event, index) => {
            return (
              <a 
                key={index} 
                href={event.facebookUrl} 
                target="_blank" 
                rel="noopener noreferrer"
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
                              onClick={(e) => e.stopPropagation()}
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
                      {showCalendarButton && (
                        <div className="event-actions">
                          <button 
                            className="calendar-btn"
                            onClick={(e) => addToCalendar(event, e)}
                            title="Ajouter au calendrier"
                          >
                            📅 Ajouter au calendrier
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Events;
