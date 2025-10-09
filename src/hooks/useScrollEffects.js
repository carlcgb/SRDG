import { useEffect } from 'react';

export const useScrollEffects = () => {
  useEffect(() => {
    let isScrolling = false;

    // Navigation scroll effect
    const handleScroll = () => {
      if (!isScrolling) {
        requestAnimationFrame(() => {
          const navbar = document.querySelector('.navbar');
          if (navbar) {
            if (window.scrollY > 100) {
              navbar.classList.add('scrolled');
            } else {
              navbar.classList.remove('scrolled');
            }
          }
          isScrolling = false;
        });
        isScrolling = true;
      }
    };

    // Observer pour les animations d'apparition
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observer les cartes d'événements
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(50px)';
      card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      observer.observe(card);
    });

    // Observer les cartes de plateformes
    const platformCards = document.querySelectorAll('.platform-card');
    platformCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(50px)';
      card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      observer.observe(card);
    });

    // Animation de chargement de la page
    const handleLoad = () => {
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.5s ease-in';
      
      setTimeout(() => {
        document.body.style.opacity = '1';
      }, 100);
    };

    // Event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('load', handleLoad);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('load', handleLoad);
      observer.disconnect();
    };
  }, []);
};
