import { useEffect, useState, useCallback, useRef } from 'react';

export const useCorporateScroll = () => {
  const [isCorporateInView, setIsCorporateInView] = useState(false);
  const corporateSectionRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastScrollY = useRef(0);

  const handleScroll = useCallback(() => {
    if (!corporateSectionRef.current) return;

    // Cancel previous animation frame to prevent accumulation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const rect = corporateSectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Check if the corporate section is in viewport
      // (section top is at or above the top of viewport and bottom is below the top)
      const isInViewport = rect.top <= viewportHeight && rect.bottom > 0;
      
      // Only update state if the value actually changed to prevent unnecessary re-renders
      if (isInViewport !== isCorporateInView) {
        setIsCorporateInView(isInViewport);
      }
    });
  }, [isCorporateInView]);

  useEffect(() => {
    // Cache the corporate section element
    corporateSectionRef.current = document.querySelector('#corporate');
    
    if (!corporateSectionRef.current) return;

    // Initial check
    handleScroll();

    // Add scroll listener with throttling
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleScroll]);

  return isCorporateInView;
};
