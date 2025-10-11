import { useState, useEffect } from 'react';
import { submitJokeToSheets } from '../services/googleSheetsService';

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

  const handleJokeSubmission = async (jokeData) => {
    try {
      
      // Afficher un message de chargement
      showNotification('Envoi de votre blague en cours...', 'info');
      
      // Soumettre à Google Sheets
      const result = await submitJokeToSheets(jokeData);
      
      if (result.success) {
        // Afficher message de confirmation
        showNotification('Merci pour votre blague ! Nous la lirons lors de nos prochains spectacles.', 'success');
      } else {
        // Afficher message d'erreur
        showNotification('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
      }
    } catch (error) {
      // Afficher message d'erreur
      showNotification('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
    }
    
    // Fermer le modal
    closeModal();
  };

  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles de la notification
    const getBackgroundColor = (type) => {
      switch (type) {
        case 'success': return '#4CAF50';
        case 'error': return '#F64A3E';
        case 'info': return '#2196F3';
        default: return '#2196F3';
      }
    };

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${getBackgroundColor(type)};
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
