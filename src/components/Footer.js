import React from 'react';

const Footer = () => {
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>La Soirée du Rire</h3>
            <span>de Granby</span>
          </div>
          <div className="footer-links">
            <a 
              href="#evenements"
              onClick={(e) => handleNavClick(e, '#evenements')}
            >
              Événements
            </a>
            <a 
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
            >
              Contact
            </a>
            <a 
              href="#blagues"
              onClick={(e) => handleNavClick(e, '#blague')}
            >
              Partager une blague
            </a>
            <a 
              href="#corporate"
              onClick={(e) => handleNavClick(e, '#corporate')}
            >
              Événements corporatifs
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 La Soirée du Rire de Granby. Tous droits réservés.</p>
          <div className="footer-legal">
            <a href="/privacy">Politique de confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
