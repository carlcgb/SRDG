import { useEffect, useRef } from 'react';

export const useParallax = () => {
  const animationFrameRef = useRef(null);
  const mascotRef = useRef(null);

  useEffect(() => {
    const hero = document.querySelector('.hero');
    const mascot = document.querySelector('.mascot-placeholder');
    
    if (hero && mascot) {
      mascotRef.current = mascot;
      
      // Throttle scroll events using requestAnimationFrame
      const handleScroll = () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        
        animationFrameRef.current = requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const rate = scrolled * -0.5;
          
          // Use transform3d for hardware acceleration and prevent reflows
          mascot.style.transform = `translate3d(0, ${rate}px, 0)`;
        });
      };

      window.addEventListener('scroll', handleScroll, { passive: true });

      // Cleanup
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, []);
};
