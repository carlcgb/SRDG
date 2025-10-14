import React, { memo } from 'react';

const Hero = memo(() => {
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
          <p className="hero-description" style={{
            opacity: 1,
            visibility: 'visible',
            transform: 'translateZ(0)',
            willChange: 'auto'
          }}>
            Découvrez les meilleurs <a href="#evenements" className="internal-link" onClick={(e) => handleNavClick(e, '#evenements')}>spectacles d'humour à Granby</a> ! Des soirées inoubliables 
            avec les humoristes québécois les plus talentueux au <a href="#contact" className="internal-link" onClick={(e) => handleNavClick(e, '#contact')}>Social Bar et Cie</a>. 
            Réservez vos billets pour des moments de pure joie et de fous rires.
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
          <div className="mascot-placeholder">
            <img 
              src={process.env.PUBLIC_URL + "/assets/images/logos/cgb.jpg"} 
              alt="La Soirée du Rire de Granby - Spectacles d'humour et comédie stand-up au Social Bar et Cie" 
              className="mascot" 
              loading="eager"
              width="300"
              height="300"
              decoding="async"
              fetchPriority="high"
              sizes="(max-width: 768px) 200px, 300px"
              srcSet={`${process.env.PUBLIC_URL}/assets/images/logos/cgb.jpg 1x, ${process.env.PUBLIC_URL}/assets/images/logos/cgb.jpg 2x`}
            />
          </div>
          <div className="animator-credit">
            <span className="animator-text">Animé par</span>
            <span className="animator-name">Carl GB</span>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
