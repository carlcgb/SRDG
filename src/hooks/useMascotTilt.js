import { useEffect, useRef } from 'react';

export const useMascotTilt = () => {
  const mascotRef = useRef(null);
  const placeholderRef = useRef(null);
  const animationFrameRef = useRef(null);

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
      // Cache DOM elements and their properties
      placeholderRef.current = mascotPlaceholder;
      mascotRef.current = mascot;
      
      // Pre-calculate center values to avoid repeated calculations
      let centerX, centerY;
      const updateCenterValues = () => {
        const rect = mascotPlaceholder.getBoundingClientRect();
        centerX = rect.width / 2;
        centerY = rect.height / 2;
      };
      
      // Initial calculation
      updateCenterValues();
      
      // Update center values on resize
      const handleResize = () => {
        updateCenterValues();
      };
      
      const handleMouseMove = (e) => {
        // Cancel previous animation frame to prevent accumulation
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        
        animationFrameRef.current = requestAnimationFrame(() => {
          const x = e.clientX - mascotPlaceholder.getBoundingClientRect().left;
          const y = e.clientY - mascotPlaceholder.getBoundingClientRect().top;
          
          const rotateX = (y - centerY) / 15;
          const rotateY = (centerX - x) / 15;
          
          // Use transform3d for hardware acceleration
          mascot.style.transform = `translate3d(0,0,0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
          mascot.style.filter = 'drop-shadow(5px 10px 15px rgba(0,0,0,0.4))';
        });
      };
      
      const handleMouseLeave = () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        
        animationFrameRef.current = requestAnimationFrame(() => {
          mascot.style.transform = 'translate3d(0,0,0) rotateX(0deg) rotateY(0deg) scale(1)';
          mascot.style.filter = 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))';
        });
      };

      mascotPlaceholder.addEventListener('mousemove', handleMouseMove, { passive: true });
      mascotPlaceholder.addEventListener('mouseleave', handleMouseLeave, { passive: true });
      window.addEventListener('resize', handleResize, { passive: true });

      // Cleanup
      return () => {
        mascotPlaceholder.removeEventListener('mousemove', handleMouseMove);
        mascotPlaceholder.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('resize', handleResize);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, []);
};
