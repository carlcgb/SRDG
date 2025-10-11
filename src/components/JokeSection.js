import React from 'react';

const JokeSection = ({ onOpenModal }) => {
  return (
    <section id="blague" className="joke-section">
      <div className="container">
        <div className="joke-content">
          <h2 className="section-title">Racontez-nous une blague !</h2>
          <p className="joke-description">
            Durant le <a href="#evenements" className="internal-link">spectacle</a>, peut-être que votre blague pourrait être 
            utilisée pour rire avec vous... ou de VOUS! Nous avons accès LIVE
             à ce que vous écrivez, on pourrait s'en servir pour nous amuser, qui sait? 😏
          </p>
          <button 
            className="btn btn-primary btn-large" 
            onClick={onOpenModal}
          >
            Partager ma blague
          </button>
          <p className="joke-contact-text">
            <a href="#contact" className="internal-link">Contactez-nous</a> pour plus d'informations sur nos spectacles d'humour.
          </p>
        </div>
      </div>
    </section>
  );
};

export default JokeSection;
