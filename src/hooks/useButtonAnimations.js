import { useEffect } from 'react';

export const useButtonAnimations = () => {
  useEffect(() => {
    const buttons = document.querySelectorAll('.btn');
    const eventHandlers = [];
    
    buttons.forEach(button => {
      const handleMouseEnter = () => {
        button.style.transform = 'translateY(-3px) scale(1.05)';
      };
      
      const handleMouseLeave = () => {
        button.style.transform = 'translateY(0) scale(1)';
      };

      button.addEventListener('mouseenter', handleMouseEnter);
      button.addEventListener('mouseleave', handleMouseLeave);
      
      // Store handlers for cleanup
      eventHandlers.push({ button, handleMouseEnter, handleMouseLeave });
    });

    // Cleanup function
    return () => {
      eventHandlers.forEach(({ button, handleMouseEnter, handleMouseLeave }) => {
        button.removeEventListener('mouseenter', handleMouseEnter);
        button.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);
};
