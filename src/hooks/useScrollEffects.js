import { useEffect } from 'react';

export const useScrollEffects = () => {
  useEffect(() => {
    // Use requestAnimationFrame to batch DOM operations
    const initScrollEffects = () => {
      requestAnimationFrame(() => {
        // Observer pour les animations d'apparition
        const observerOptions = {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
          // Use requestAnimationFrame to batch style changes
          requestAnimationFrame(() => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
              }
            });
          });
        }, observerOptions);

        // Batch DOM queries
        const eventCards = document.querySelectorAll('.event-card');
        const platformCards = document.querySelectorAll('.platform-card');
        
        // Apply styles and observe in batches
        [...eventCards, ...platformCards].forEach(card => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(50px)';
          card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
          observer.observe(card);
        });

        // Store observer for cleanup
        window.scrollObserver = observer;
      });
    };

    // Animation de chargement de la page - optimized
    const handleLoad = () => {
      requestAnimationFrame(() => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease-in';
        
        requestAnimationFrame(() => {
          setTimeout(() => {
            document.body.style.opacity = '1';
          }, 100);
        });
      });
    };

    // Initialize effects after a short delay to prevent blocking
    const timeoutId = setTimeout(initScrollEffects, 100);
    window.addEventListener('load', handleLoad);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('load', handleLoad);
      if (window.scrollObserver) {
        window.scrollObserver.disconnect();
        delete window.scrollObserver;
      }
    };
  }, []);
};
