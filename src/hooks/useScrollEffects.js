import { useEffect, useRef } from 'react';

export const useScrollEffects = () => {
  const observerRef = useRef(null);
  const animationFrameRef = useRef(null);

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
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          
          animationFrameRef.current = requestAnimationFrame(() => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                // Use transform3d for hardware acceleration
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translate3d(0, 0, 0)';
                // Remove from observer after animation to improve performance
                observer.unobserve(entry.target);
              }
            });
          });
        }, observerOptions);

        // Batch DOM queries and cache elements
        const eventCards = document.querySelectorAll('.event-card');
        const platformCards = document.querySelectorAll('.platform-card');
        
        // Apply styles and observe in batches
        [...eventCards, ...platformCards].forEach(card => {
          // Use transform3d for hardware acceleration
          card.style.opacity = '0';
          card.style.transform = 'translate3d(0, 50px, 0)';
          card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
          card.style.willChange = 'opacity, transform'; // Hint for browser optimization
          observer.observe(card);
        });

        // Store observer for cleanup
        observerRef.current = observer;
        window.scrollObserver = observer;
      });
    };

    // Animation de chargement de la page - optimized
    const handleLoad = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      animationFrameRef.current = requestAnimationFrame(() => {
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
    window.addEventListener('load', handleLoad, { passive: true });

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('load', handleLoad);
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (window.scrollObserver) {
        window.scrollObserver.disconnect();
        delete window.scrollObserver;
      }
    };
  }, []);
};
