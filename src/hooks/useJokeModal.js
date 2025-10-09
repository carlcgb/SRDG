import { useState, useEffect } from 'react';

export const useJokeModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleJokeSubmission = (jokeData) => {
    // Simulation d'envoi (remplacer par vraie logique)
    console.log('Blague soumise:', jokeData);
    
    // Afficher message de confirmation
    showNotification('Merci pour votre blague ! Nous la lirons lors de nos prochains spectacles.', 'success');
    
    // Fermer le modal
    closeModal();
  };

  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles de la notification
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#4CAF50' : '#F64A3E'};
      color: white;
      padding: 15px 25px;
      border-radius: 10px;
      font-weight: 600;
      text-transform: uppercase;
      z-index: 3000;
      transform: translateX(100%);
      transition: transform 0.3s ease-out;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Supprimer après 5 secondes
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  };

  // Fermer le modal avec la touche Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  // Fermer le modal en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      const modal = document.querySelector('.modal');
      if (modal && e.target === modal && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isModalOpen]);

  return {
    isModalOpen,
    openModal,
    closeModal,
    handleJokeSubmission
  };
};
