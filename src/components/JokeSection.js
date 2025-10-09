import React from 'react';

const JokeSection = ({ onOpenModal }) => {
  return (
    <section id="blague" className="joke-section">
      <div className="container">
        <div className="joke-content">
          <h2 className="section-title">Racontez-nous une blague !</h2>
          <p className="joke-description">
            Vous avez une blague qui vous fait rire ? Partagez-la avec nous ! 
            Les meilleures blagues pourraient être utilisées lors de nos spectacles.
          </p>
          <button 
            className="btn btn-primary btn-large" 
            onClick={onOpenModal}
          >
            Partager ma blague
          </button>
        </div>
      </div>
    </section>
  );
};

export default JokeSection;
