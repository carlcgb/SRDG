import React from 'react';

const Hero = () => {
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
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">La Soirée du Rire</h1>
          <h2 className="hero-subtitle">de Granby</h2>
          <p className="hero-description">
            Venez rire avec nous ! Des soirées inoubliables remplies d'humour, 
            de bonne humeur et de moments de pure joie à Granby.
          </p>
          <div className="hero-buttons">
            <a 
              href="#contact" 
              className="btn btn-primary"
              onClick={(e) => handleNavClick(e, '#contact')}
            >
              Nous Contacter
            </a>
            <a 
              href="#evenements" 
              className="btn btn-secondary"
              onClick={(e) => handleNavClick(e, '#evenements')}
            >
              Voir les Événements
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="animator-credit">
            <span className="animator-text">Animé par</span>
            <span className="animator-name">CARL GB</span>
          </div>
          <div className="mascot-placeholder">
            <img src="./style/cgb.jpg" alt="La Soirée du Rire de Granby" className="mascot" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
