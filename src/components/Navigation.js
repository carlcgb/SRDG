import React from 'react';
import { useCorporateScroll } from '../hooks/useCorporateScroll';

const Navigation = () => {
  const isCorporateInView = useCorporateScroll();
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const offsetTop = targetElement.offsetTop;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={`navbar ${isCorporateInView ? 'corporate-theme' : ''}`}>
      <div className="nav-container">
        <div className="logo">
          <h1>La Soirée du Rire</h1>
          <span>de Granby</span>
        </div>
        <div className="nav-menu">
          <a 
            href="#evenements" 
            className="nav-link"
            onClick={(e) => handleNavClick(e, '#evenements')}
          >
            Événements
          </a>
          <a 
            href="#contact" 
            className="nav-link"
            onClick={(e) => handleNavClick(e, '#contact')}
          >
            Contact
          </a>
          <a 
            href="#blague" 
            className="nav-link"
            onClick={(e) => handleNavClick(e, '#blague')}
          >
            Blague
          </a>
          <a 
            href="https://app.tixigo.com/TOffice?token=sNozI5aN0tE7QVy3zaUxCFBQFtB%2Bg7sW0cWMhItujXo%3D&fbclid=IwY2xjawJNWLxleHRuA2FlbQIxMAABHTuOYmPpzVBIIiAXos2mv-ElAtqrkM9IknwJp84I-jt4sU0Ouc6RFQdqOA_aem_F6YCpxptwl6T8vrqwoyuxg" 
            target="_blank" 
            rel="noopener noreferrer"
            className="nav-tickets-btn"
          >
            Acheter des billets
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
