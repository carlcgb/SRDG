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
            <p>Spectacles d'humour mensuels au Social Bar et Cie</p>
          </div>
          
          <div className="footer-sections">
            <div className="footer-section">
              <h4>Navigation</h4>
              <div className="footer-links">
                <a 
                  href="#evenements"
                  onClick={(e) => handleNavClick(e, '#evenements')}
                >
                  Événements
                </a>
                <a 
                  href="#corporate"
                  onClick={(e) => handleNavClick(e, '#corporate')}
                >
                  Événements Corporatifs
                </a>
                <a 
                  href="#plateformes"
                  onClick={(e) => handleNavClick(e, '#plateformes')}
                >
                  Réseaux Sociaux
                </a>
                <a 
                  href="#blague"
                  onClick={(e) => handleNavClick(e, '#blague')}
                >
                  Partager une blague
                </a>
                <a 
                  href="#contact"
                  onClick={(e) => handleNavClick(e, '#contact')}
                >
                  Contact
                </a>
              </div>
            </div>

            <div className="footer-section">
              <h4>Ressources</h4>
              <div className="footer-links">
                <a 
                  href="https://app.tixigo.com/TOffice?token=sNozI5aN0tE7QVy3zaUxCFBQFtB%2Bg7sW0cWMhItujXo%3D&fbclid=IwY2xjawJNWLxleHRuA2FlbQIxMAABHTuOYmPpzVBIIiAXos2mv-ElAtqrkM9IknwJp84I-jt4sU0Ouc6RFQdqOA_aem_F6YCpxptwl6T8vrqwoyuxg" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Acheter des billets
                </a>
                <a 
                  href="https://www.facebook.com/lsdrg" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
                <a 
                  href="https://www.instagram.com/lsdrdg/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
                <a 
                  href="https://www.tiktok.com/@carl.cgb" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  TikTok
                </a>
              </div>
            </div>

            <div className="footer-section">
              <h4>Partenaires</h4>
              <div className="footer-links">
                <a 
                  href="https://www.socialbar.ca/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Social Bar et Cie
                </a>
                <a 
                  href="https://www.granby.ca/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Ville de Granby
                </a>
                <a 
                  href="https://www.tourisme-montreal.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Tourisme Montréal
                </a>
                <a 
                  href="https://www.quebecoriginal.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Québec Original
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 La Soirée du Rire de Granby. Tous droits réservés.</p>
            <div className="footer-bottom-links">
              <a href="mailto:info@lasoireedurire.ca">info@lasoireedurire.ca</a>
              <a href="tel:+14509913336">(450) 991-3336</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
