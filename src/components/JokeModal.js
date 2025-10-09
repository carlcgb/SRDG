import React, { useState } from 'react';

const JokeModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    jokeTitle: '',
    jokeContent: '',
    jokeAuthor: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      jokeTitle: '',
      jokeContent: '',
      jokeAuthor: ''
    });
  };

  const handleClose = () => {
    setFormData({
      jokeTitle: '',
      jokeContent: '',
      jokeAuthor: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal show">
      <div className="modal-content">
        <span className="close" onClick={handleClose}>&times;</span>
        <h2>Partagez votre blague</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="jokeTitle">Titre de votre blague :</label>
            <input
              type="text"
              id="jokeTitle"
              name="jokeTitle"
              value={formData.jokeTitle}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="jokeContent">Votre blague :</label>
            <textarea
              id="jokeContent"
              name="jokeContent"
              rows="4"
              value={formData.jokeContent}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="jokeAuthor">Votre nom (optionnel) :</label>
            <input
              type="text"
              id="jokeAuthor"
              name="jokeAuthor"
              value={formData.jokeAuthor}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Envoyer ma blague
          </button>
        </form>
      </div>
    </div>
  );
};

export default JokeModal;
