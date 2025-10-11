import { useEffect } from 'react';

export const useMascotTilt = () => {
  useEffect(() => {
    // Check if device is mobile
    const isMobile = window.innerWidth <= 768;
    
    // Don't apply tilt effects on mobile devices
    if (isMobile) {
      return;
    }
    
    const mascotPlaceholder = document.querySelector('.mascot-placeholder');
    const mascot = document.querySelector('.mascot');
    
    if (mascotPlaceholder && mascot) {
      const handleMouseMove = (e) => {
        const rect = mascotPlaceholder.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        
        mascot.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        mascot.style.filter = 'drop-shadow(5px 10px 15px rgba(0,0,0,0.4))';
      };
      
      const handleMouseLeave = () => {
        mascot.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        mascot.style.filter = 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))';
      };

      mascotPlaceholder.addEventListener('mousemove', handleMouseMove);
      mascotPlaceholder.addEventListener('mouseleave', handleMouseLeave);

      // Cleanup
      return () => {
        mascotPlaceholder.removeEventListener('mousemove', handleMouseMove);
        mascotPlaceholder.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);
};
