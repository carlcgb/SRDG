import { useEffect } from 'react';

export const useButtonAnimations = () => {
  useEffect(() => {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      const handleMouseEnter = () => {
        button.style.transform = 'translateY(-3px) scale(1.05)';
      };
      
      const handleMouseLeave = () => {
        button.style.transform = 'translateY(0) scale(1)';
      };

      button.addEventListener('mouseenter', handleMouseEnter);
      button.addEventListener('mouseleave', handleMouseLeave);

      // Cleanup
      return () => {
        button.removeEventListener('mouseenter', handleMouseEnter);
        button.removeEventListener('mouseleave', handleMouseLeave);
      };
    });
  }, []);
};
