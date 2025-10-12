import { useEffect, useState, useCallback } from 'react';

export const useCorporateScroll = () => {
  const [isCorporateInView, setIsCorporateInView] = useState(false);

  const handleScroll = useCallback(() => {
    const corporateSection = document.querySelector('#corporate');
    if (!corporateSection) return;

    // Use requestAnimationFrame to batch DOM reads and prevent forced reflows
    requestAnimationFrame(() => {
      const rect = corporateSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Check if the corporate section is in viewport
      // (section top is at or above the top of viewport and bottom is below the top)
      const isInViewport = rect.top <= viewportHeight && rect.bottom > 0;
      
      setIsCorporateInView(isInViewport);
    });
  }, []);

  useEffect(() => {
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
    };
  }, [handleScroll]);

  return isCorporateInView;
};
