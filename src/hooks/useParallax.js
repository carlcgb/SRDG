import { useEffect } from 'react';

export const useParallax = () => {
  useEffect(() => {
    const hero = document.querySelector('.hero');
    const mascot = document.querySelector('.mascot-placeholder');
    
    if (hero && mascot) {
      const handleScroll = () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        mascot.style.transform = `translateY(${rate}px)`;
      };

      window.addEventListener('scroll', handleScroll);

      // Cleanup
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);
};
